import React, { useState } from 'react';

const ALGO_COLORS = {
  FCFS: '#00ff41',
  SJF: '#00d4ff',
  SRTF: '#ff6b35',
  RR: '#ff3f96',
};

export default function CompareChart({ results }) {
  const [showCompare, setShowCompare] = useState(false);
  const algorithmNames = Object.keys(results);

  if (algorithmNames.length < 2) return null;

  const metrics = [
    { key: 'avgWaiting', label: 'Avg Waiting Time' },
    { key: 'avgTurnaround', label: 'Avg Turnaround Time' },
    { key: 'avgResponse', label: 'Avg Response Time' },
  ];

  // Find max value for scaling
  const maxVal = Math.max(
    ...algorithmNames.flatMap((name) =>
      metrics.map((m) => results[name][m.key])
    ),
    1
  );

  return (
    <div className="terminal-panel" id="compare-chart-panel">
      <div className="panel-header">
        <span className="panel-dots">●●●</span>
        <span className="panel-label">COMPARISON</span>
      </div>
      <div className="panel-body">
        <button
          className={`btn-compare ${showCompare ? 'btn-compare-active' : ''}`}
          onClick={() => setShowCompare(!showCompare)}
          id="btn-compare-toggle"
        >
          ⚖ COMPARE ALL ALGORITHMS
        </button>

        {showCompare && (
          <div className="compare-grid">
            {metrics.map((metric) => (
              <div key={metric.key} className="compare-metric">
                <h4 className="compare-metric-label">{metric.label}</h4>
                <div className="compare-bars">
                  {algorithmNames.map((name) => {
                    const value = results[name][metric.key];
                    const widthPercent = (value / maxVal) * 100;
                    return (
                      <div key={name} className="compare-bar-row">
                        <span className="compare-algo-name">{name}</span>
                        <div className="compare-bar-track">
                          <div
                            className="compare-bar-fill"
                            style={{
                              width: `${widthPercent}%`,
                              backgroundColor:
                                ALGO_COLORS[name] || '#00ff41',
                            }}
                          ></div>
                        </div>
                        <span className="compare-bar-value">
                          {value.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
