import PartsBreakdown from './PartsBreakdown';
import FaultHistory from './FaultHistory';

const SPECS = [
  ['engine', 'Engine'],
  ['horsepower', 'Power'],
  ['torque', 'Torque'],
  ['transmission', 'Gearbox'],
  ['drivetrain', 'Drive'],
  ['productionYears', 'Production'],
  ['msrpOriginal', 'Original MSRP']
];

export default function CarResult({ data }) {
  const { car, parts, faults } = data;

  const criticalCount = faults.filter(f => f.severity === 'Critical').length;
  const avgPrice = Math.round(
    parts.reduce((sum, p) => sum + (p.priceMin + p.priceMax) / 2, 0) / parts.length
  );

  return (
    <div className="car-result">
      <div className="car-header">
        <div className="car-identity">
          <div className="car-badge">{car.year}</div>
          <div>
            <h1 className="car-name">{car.make} {car.model}</h1>
            <p className="car-trim">{car.trim}{car.bodyStyle ? ` · ${car.bodyStyle}` : ''}</p>
          </div>
        </div>
        <div className="car-stats">
          <div className="stat">
            <span className="stat-value">{parts.length}</span>
            <span className="stat-label">Parts tracked</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className={`stat-value ${criticalCount > 0 ? 'critical' : 'ok'}`}>{criticalCount}</span>
            <span className="stat-label">Critical faults</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-value">${avgPrice.toLocaleString()}</span>
            <span className="stat-label">Avg part cost</span>
          </div>
        </div>
      </div>

      <div className="car-specs">
        {SPECS.map(([key, label]) =>
          car[key] ? (
            <div key={key} className="spec-item">
              <span className="spec-label">{label}</span>
              <span className="spec-value">
                {key === 'horsepower' ? `${car[key]} hp` : car[key]}
              </span>
            </div>
          ) : null
        )}
      </div>

      <div className="results-sections">
        <PartsBreakdown parts={parts} />
        <FaultHistory faults={faults} />
      </div>
    </div>
  );
}
