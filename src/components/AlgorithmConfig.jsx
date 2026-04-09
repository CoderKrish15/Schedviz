import React from 'react';

export default function AlgorithmConfig({
  algorithm,
  setAlgorithm,
  quantum,
  setQuantum,
  speed,
  setSpeed,
  onRun,
  onReset,
  onRandomize,
  isPlaying,
  isComplete,
  onPause,
  onReplay,
  hasProcesses,
  errorMessage,
}) {
  const handleQuantumChange = (delta) => {
    setQuantum((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  const getRunLabel = () => {
    if (isPlaying) return '⏸ PAUSE';
    if (isComplete) return '▶ REPLAY';
    return '▶ RUN SIMULATION';
  };

  const handleRunClick = () => {
    if (isPlaying) {
      onPause();
    } else if (isComplete) {
      onReplay();
    } else {
      onRun();
    }
  };

  return (
    <div className="terminal-panel" id="algorithm-config-panel">
      <div className="panel-header">
        <span className="panel-dots">●●●</span>
        <span className="panel-label">ALGORITHM_CONFIG</span>
      </div>
      <div className="panel-body">
        {/* Algorithm Selection */}
        <div className="config-section">
          <label className="config-label">SELECT ALGORITHM</label>
          <div className="algo-buttons">
            {['FCFS', 'SJF', 'RR'].map((algo) => (
              <button
                key={algo}
                className={`algo-btn ${
                  algorithm === algo ? 'algo-btn-active' : ''
                }`}
                onClick={() => setAlgorithm(algo)}
                id={`btn-algo-${algo}`}
              >
                {algo}
              </button>
            ))}
          </div>
        </div>


        {/* RR Quantum */}
        {algorithm === 'RR' && (
          <div className="config-section">
            <label className="config-label">TIME QUANTUM</label>
            <div className="quantum-control">
              <button
                className="quantum-btn"
                onClick={() => handleQuantumChange(-1)}
                disabled={quantum <= 1}
                id="btn-quantum-dec"
              >
                −
              </button>
              <span className="quantum-value" id="quantum-display">{quantum} ms</span>
              <button
                className="quantum-btn"
                onClick={() => handleQuantumChange(1)}
                disabled={quantum >= 10}
                id="btn-quantum-inc"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Speed Slider */}
        <div className="config-section">
          <label className="config-label">EXEC SPEED</label>
          <div className="speed-slider-wrap">
            <span className="speed-label">Slow</span>
            <input
              type="range"
              className="speed-slider"
              min="100"
              max="1000"
              value={1100 - speed}
              onChange={(e) => setSpeed(1100 - parseInt(e.target.value, 10))}
              id="speed-slider"
            />
            <span className="speed-label">Fast</span>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="error-message" id="error-message">
            {errorMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className={`btn-run ${!hasProcesses ? 'btn-shake' : ''}`}
            onClick={handleRunClick}
            id="btn-run"
          >
            {getRunLabel()}
          </button>
          <div className="btn-row">
            <button className="btn-secondary" onClick={onReset} id="btn-reset">
              ↺ RESET
            </button>
            <button className="btn-secondary" onClick={onRandomize} id="btn-randomize">
              ⟳ RANDOM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
