const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 5001;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

Return ONLY this exact JSON structure (no markdown, no explanation outside it):
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
      "id": "unique-string",
      "category": "Engine|Drivetrain|Suspension|Brakes|Body|Interior|Electrical|Exhaust|Cooling",
      "name": "string",
      "partNumber": "string",
      "description": "string (1-2 sentences)",
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
      "id": "unique-string",
      "severity": "Critical|High|Medium|Low",
      "title": "string",
      "description": "string (2-3 sentences with technical detail)",
      "affectedYears": "string",
      "frequency": "Very Common|Common|Occasional|Rare",
      "symptoms": ["string", "string", "string"],
      "repairCostMin": number,
      "repairCostMax": number,
      "diyPossible": boolean,
      "preventionTip": "string"
    }
  ]
}

Include 15-20 key parts across all major categories with 2-3 sourcing options each.
Include 5-8 real-world known fault and reliability issues for this specific model and generation.`;
}

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    const hasImage = !!req.file;
    const text = req.body.text;

    if (!hasImage && !text) {
      return res.status(400).json({ error: 'Provide an image or a car description.' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY is not set. Add it to your Replit Secrets.' });
    }

    let messages;

    if (hasImage) {
      const mimeType = req.file.mimetype;
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(mimeType)) {
        return res.status(400).json({ error: 'Unsupported image format. Use JPEG, PNG, or WebP.' });
      }
      const base64 = req.file.buffer.toString('base64');
      messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}` } },
            { type: 'text', text: buildPrompt(null, true) }
          ]
        }
      ];
    } else {
      messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildPrompt(text, false) }
      ];
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 4096,
      messages
    });

    const rawText = response.choices[0].message.content.trim();

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
