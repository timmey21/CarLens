const STEPS = ['Identifying vehicle…', 'Compiling parts database…', 'Retrieving fault history…'];

export default function LoadingSpinner() {
  return (
    <div className="loading-overlay">
      <div className="spinner-ring" />
      <p className="spinner-label">
        Analyzing<span className="dots"><span>.</span><span>.</span><span>.</span></span>
      </p>
      <div className="loading-steps">
        {STEPS.map((s, i) => (
          <p key={i} className="loading-step" style={{ animationDelay: `${i * 1}s` }}>{s}</p>
        ))}
      </div>
    </div>
  );
}
