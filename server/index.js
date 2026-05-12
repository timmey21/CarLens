const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 5001;
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

const SYSTEM_PROMPT = `You are CarLens, an expert automotive data system specializing in sports cars.
Always respond with valid JSON only. Never use markdown code blocks. Never add explanations outside the JSON.
Provide accurate, realistic USD pricing based on current market data. Include real OEM part numbers where known.`;

function buildPrompt(carText, hasImage) {
  const intro = hasImage
    ? 'Identify this sports car from the image and provide a complete analysis.'
    : `Analyze this sports car: ${carText}`;

  return `${intro}

Return ONLY valid JSON, no markdown, no explanation:
{
  "car": {
    "make": "string",
    "model": "string",
    "year": number,
    "trim": "string",
    "bodyStyle": "string",
    "engine": "string",
    "horsepower": number,
    "torque": "string",
    "transmission": "string",
    "drivetrain": "string",
    "productionYears": "string",
    "msrpOriginal": "string"
  },
  "parts": [
    {
      "id": "string",
      "category": "Engine|Drivetrain|Suspension|Brakes|Body|Interior|Electrical|Exhaust|Cooling",
      "name": "string",
      "partNumber": "string",
      "description": "string (1 sentence max)",
      "priceMin": number,
      "priceMax": number,
      "sources": [
        {"name": "string", "type": "OEM Dealer|Independent|Aftermarket|Used/OEM", "priceEstimate": number}
      ],
      "availability": "In Stock|Limited|Special Order|Discontinued",
      "difficulty": "DIY Friendly|Moderate|Professional Required",
      "laborHours": number
    }
  ],
  "faults": [
    {
      "id": "string",
      "severity": "Critical|High|Medium|Low",
      "title": "string",
      "description": "string (1 sentence max)",
      "affectedYears": "string",
      "frequency": "Very Common|Common|Occasional|Rare",
      "symptoms": ["string", "string"],
      "repairCostMin": number,
      "repairCostMax": number,
      "diyPossible": boolean,
      "preventionTip": "string"
    }
  ]
}

Include exactly 10 parts spread across different categories with 2 sources each.
Include exactly 5 fault issues. Keep all text fields short and concise.`;
}

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    const hasImage = !!req.file;
    const text = req.body.text;

    if (!hasImage && !text) {
      return res.status(400).json({ error: 'Provide an image or a car description.' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not set. Add it to your Replit Secrets.' });
    }

    let messageContent;

    if (hasImage) {
      const mimeType = req.file.mimetype;
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(mimeType)) {
        return res.status(400).json({ error: 'Unsupported image format. Use JPEG, PNG, or WebP.' });
      }
      messageContent = [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: mimeType,
            data: req.file.buffer.toString('base64')
          }
        },
        { type: 'text', text: buildPrompt(null, true) }
      ];
    } else {
      messageContent = buildPrompt(text, false);
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: messageContent }]
    });

    const rawText = response.content[0].text.trim();

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('AI returned an unexpected format. Please try again.');
      data = JSON.parse(match[0]);
    }

    if (!data.car || !data.parts || !data.faults) {
      throw new Error('Incomplete data returned. Please try again.');
    }

    res.json(data);
  } catch (err) {
    console.error('Analyze error:', err.message);
    res.status(500).json({ error: err.message || 'Analysis failed. Please try again.' });
  }
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CarLens API running on port ${PORT}`);
});
