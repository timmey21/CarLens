import { useState } from 'react';
import CarInput from './components/CarInput';
import CarResult from './components/CarResult';
import LoadingSpinner from './components/LoadingSpinner';
import { DEMO_FERRARI, DEMO_PORSCHE, DEMO_MCLAREN, DEMO_LAMBORGHINI } from './demoData';

const DEMOS = {
  'Ferrari 458 Italia 2012': DEMO_FERRARI,
  'Porsche 911 GT3 RS 2023': DEMO_PORSCHE,
  'McLaren 720S 2019': DEMO_MCLAREN,
  'Lamborghini Huracán EVO 2020': DEMO_LAMBORGHINI,
};

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (input) => {
    if (input.type === 'text' && DEMOS[input.text]) {
      setError(null);
      setResult(DEMOS[input.text]);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let response;
      if (input.type === 'image') {
        const formData = new FormData();
        formData.append('image', input.file);
        response = await fetch('/api/analyze', { method: 'POST', body: formData });
      } else {
        response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: input.text })
        });
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Analysis failed');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = (carName) => {
    setError(null);
    setResult(DEMOS[carName]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <div className="logo-mark">CL</div>
          <span className="logo-text">Car<span className="logo-accent">Lens</span></span>
        </div>
        <p className="tagline">AI-powered sports car parts intelligence</p>
      </header>

      <main className="app-main">
        <CarInput onAnalyze={handleAnalyze} onDemo={handleDemo} loading={loading} />
        {loading && <LoadingSpinner />}
        {error && <div className="error-banner">⚠ {error}</div>}
        {result && <CarResult data={result} />}
      </main>

      <footer className="app-footer">
        Powered by Claude AI &nbsp;·&nbsp; Pricing estimates for reference only
      </footer>
    </div>
  );
}
