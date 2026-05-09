import { useState } from 'react';

const SEV_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 };

const SEV_STYLE = {
  Critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', icon: '⚠' },
  High:     { color: '#f97316', bg: 'rgba(249,115,22,0.12)', icon: '▲' },
  Medium:   { color: '#eab308', bg: 'rgba(234,179,8,0.12)',  icon: '◆' },
  Low:      { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',  icon: '●' }
};

const FREQ_STYLE = {
  'Very Common': { pct: '90%', color: '#ef4444' },
  'Common':      { pct: '65%', color: '#f97316' },
  'Occasional':  { pct: '35%', color: '#eab308' },
  'Rare':        { pct: '15%', color: '#22c55e' }
};

export default function FaultHistory({ faults }) {
  const [expandedId, setExpandedId] = useState(null);

  const sorted = [...faults].sort((a, b) => (SEV_ORDER[a.severity] ?? 4) - (SEV_ORDER[b.severity] ?? 4));

  const toggle = (id) => setExpandedId(prev => prev === id ? null : id);

  return (
    <section className="faults-section">
      <h2 className="section-title">
        <span className="section-icon">⚡</span>
        Common Fault History
        <span className="section-count">{faults.length} known issues</span>
      </h2>

      <div className="faults-list">
        {sorted.map(fault => {
          const sev = SEV_STYLE[fault.severity] || SEV_STYLE.Low;
          const freq = FREQ_STYLE[fault.frequency] || FREQ_STYLE['Occasional'];
          const isOpen = expandedId === fault.id;

          return (
            <div
              key={fault.id}
              className={`fault-card ${isOpen ? 'expanded' : ''}`}
              style={{ '--sev-color': sev.color }}
              onClick={() => toggle(fault.id)}
            >
              <div className="fault-header">
                <div className="fault-sev-dot" style={{ background: sev.color }}>
                  {sev.icon}
                </div>

                <div className="fault-main">
                  <div className="fault-top-row">
                    <span className="sev-badge" style={{ color: sev.color, background: sev.bg }}>
                      {fault.severity}
                    </span>
                    <span className="years-badge">{fault.affectedYears}</span>
                  </div>
                  <h3 className="fault-title">{fault.title}</h3>
                  <div className="freq-row">
                    <span className="freq-label">Frequency: {fault.frequency}</span>
                    <div className="freq-track">
                      <div className="freq-fill" style={{ width: freq.pct, background: freq.color }} />
                    </div>
                  </div>
                </div>

                <div className="fault-cost">
                  <span className="cost-range">
                    ${fault.repairCostMin.toLocaleString()}–${fault.repairCostMax.toLocaleString()}
                  </span>
                  <span className="cost-label">Repair est.</span>
                </div>
              </div>

              {isOpen && (
                <div className="fault-details">
                  <p className="fault-desc">{fault.description}</p>

                  {fault.symptoms && fault.symptoms.length > 0 && (
                    <div className="fault-symptoms">
                      <h4>Symptoms</h4>
                      <ul>
                        {fault.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}

                  <div className="fault-footer">
                    <span className={`diy-badge ${fault.diyPossible ? 'yes' : 'no'}`}>
                      {fault.diyPossible ? '✓ DIY Possible' : '✗ Professional Required'}
                    </span>
                    {fault.preventionTip && (
                      <p className="prevention-tip">💡 {fault.preventionTip}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
