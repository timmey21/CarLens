import { useState, useRef, useCallback } from 'react';

const EXAMPLES = [
  'Ferrari 458 Italia 2012',
  'Lamborghini Huracán EVO 2020',
  'Porsche 911 GT3 RS 2023',
  'McLaren 720S 2019',
];

export default function CarInput({ onAnalyze, onDemo, loading }) {
  const [mode, setMode] = useState('text');
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const applyFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    applyFile(e.dataTransfer.files[0]);
  }, []);

  const clearImage = (e) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'text' && text.trim()) {
      onAnalyze({ type: 'text', text: text.trim() });
    } else if (mode === 'image' && imageFile) {
      onAnalyze({ type: 'image', file: imageFile });
    }
  };

  const canSubmit = !loading && (mode === 'text' ? text.trim().length > 0 : !!imageFile);

  return (
    <div className="car-input">
      <div className="mode-tabs">
        <button className={`mode-tab ${mode === 'text' ? 'active' : ''}`} onClick={() => setMode('text')}>
          Type Model
        </button>
        <button className={`mode-tab ${mode === 'image' ? 'active' : ''}`} onClick={() => setMode('image')}>
          Upload Photo
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === 'text' ? (
          <div className="text-section">
            <input
              type="text"
              className="car-text-input"
              placeholder="e.g. Ferrari 458 Italia 2012"
              value={text}
              onChange={e => setText(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>
        ) : (
          <div
            className={`upload-zone ${dragOver ? 'drag-over' : ''} ${imagePreview ? 'has-preview' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !imagePreview && fileInputRef.current.click()}
          >
            {imagePreview ? (
              <div className="image-preview">
                <img src={imagePreview} alt="Selected car" />
                <button type="button" className="remove-image" onClick={clearImage}>✕</button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon">📸</div>
                <p>Drop a photo here or <span className="upload-link">click to browse</span></p>
                <span className="upload-hint">JPG, PNG, WebP · Max 10 MB</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={e => applyFile(e.target.files[0])}
            />
          </div>
        )}

        <button type="submit" className="analyze-btn" disabled={!canSubmit}>
          {loading ? 'Analyzing…' : 'Analyze Car'}
        </button>
      </form>

      <div className="demo-section">
        <p className="demo-label">Try a free demo — no API key needed:</p>
        <div className="demo-cars">
          {EXAMPLES.map(car => (
            <button
              key={car}
              className="demo-car-btn"
              onClick={() => onDemo(car)}
              disabled={loading}
            >
              {car}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
