import { useState } from 'react';

const AVAIL_COLOR = {
  'In Stock': 'green',
  'Limited': 'yellow',
  'Special Order': 'orange',
  'Discontinued': 'red'
};

const DIFF_COLOR = {
  'DIY Friendly': 'green',
  'Moderate': 'yellow',
  'Professional Required': 'red'
};

export default function PartsBreakdown({ parts }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const categories = ['All', ...new Set(parts.map(p => p.category))];
  const visible = activeCategory === 'All' ? parts : parts.filter(p => p.category === activeCategory);

  const toggle = (id) => setExpandedId(prev => prev === id ? null : id);

  return (
    <section className="parts-section">
      <h2 className="section-title">
        <span className="section-icon">⚙</span>
        Parts Breakdown
        <span className="section-count">{parts.length} components</span>
      </h2>

      <div className="category-tabs">
        {categories.map(cat => (
          <button
            key={cat}
            className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => { setActiveCategory(cat); setExpandedId(null); }}
          >
            {cat}
            {cat !== 'All' && (
              <span className="cat-count">{parts.filter(p => p.category === cat).length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="parts-grid">
        {visible.map(part => (
          <div
            key={part.id}
            className={`part-card ${expandedId === part.id ? 'expanded' : ''}`}
            onClick={() => toggle(part.id)}
          >
            <div className="part-header">
              <div className="part-info">
                <span className="part-category-tag">{part.category}</span>
                <h3 className="part-name">{part.name}</h3>
                <span className="part-number">#{part.partNumber}</span>
              </div>
              <div className="part-price-col">
                <span className="price-range">
                  ${part.priceMin.toLocaleString()}–${part.priceMax.toLocaleString()}
                </span>
                <span className={`avail-badge ${AVAIL_COLOR[part.availability] || 'yellow'}`}>
                  {part.availability}
                </span>
              </div>
            </div>

            {expandedId === part.id && (
              <div className="part-details">
                <p className="part-description">{part.description}</p>

                <div className="part-meta-row">
                  <span className={`diff-badge ${DIFF_COLOR[part.difficulty] || 'yellow'}`}>
                    {part.difficulty}
                  </span>
                  {part.laborHours > 0 && (
                    <span className="labor-time">{part.laborHours}h est. labor</span>
                  )}
                </div>

                {part.sources && part.sources.length > 0 && (
                  <div className="sources">
                    <h4 className="sources-heading">Where to Source</h4>
                    {part.sources.map((src, i) => (
                      <div key={i} className="source-row">
                        <span className="source-name">{src.name}</span>
                        <span className="source-type">{src.type}</span>
                        <span className="source-price">${src.priceEstimate.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
