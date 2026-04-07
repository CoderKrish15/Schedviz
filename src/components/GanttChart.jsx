import React, { useState, useRef } from 'react';
import { PROCESS_COLORS } from '../algorithms';
import Tooltip from './Tooltip';

export default function GanttChart({
  timeline,
  currentStep,
  processes,
  preemptions,
  highlightPid,
  setHighlightPid,
}) {
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: null,
    x: 0,
    y: 0,
  });
  const containerRef = useRef(null);

  if (!timeline || timeline.length === 0) {
    return (
      <div className="terminal-panel" id="gantt-chart-panel">
        <div className="panel-header">
          <span className="panel-dots">●●●</span>
          <span className="panel-label">GANTT_CHART</span>
        </div>
        <div className="panel-body gantt-empty">
          <p className="empty-text">
            AWAITING SIMULATION
            <span className="blink-cursor">_</span>
          </p>
        </div>
      </div>
    );
  }

  const totalTime = timeline.reduce((max, s) => Math.max(max, s.end), 0);
  const pidColorMap = {};
  if (processes) {
    processes.forEach((p, i) => {
      pidColorMap[p.pid] = PROCESS_COLORS[i % PROCESS_COLORS.length];
    });
  }

  // Also map from timeline process ordering based on input processes list
  const inputProcs = processes || [];

  const handleSlotHover = (slot, e) => {
    setTooltip({
      visible: true,
      content: (
        <div className="tooltip-content">
          <div>
            <strong>Process:</strong> {slot.pid}
          </div>
          <div>
            Start: {slot.start}ms | End: {slot.end}ms
          </div>
          <div>Duration: {slot.end - slot.start}ms</div>
        </div>
      ),
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handlePreemptionHover = (p, e) => {
    setTooltip({
      visible: true,
      content: (
        <div className="tooltip-content">
          <div>
            {p.by} preempted {p.preempted} at t={p.at}
          </div>
        </div>
      ),
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, content: null, x: 0, y: 0 });
  };

  const slotWidth = 52;

  return (
    <div className="terminal-panel" id="gantt-chart-panel">
      <div className="panel-header">
        <span className="panel-dots">●●●</span>
        <span className="panel-label">GANTT_CHART</span>
      </div>
      <div className="panel-body">
        <div className="gantt-scroll" ref={containerRef}>
          <div
            className="gantt-track"
            style={{ width: `${totalTime * slotWidth}px` }}
          >
            {/* Current time pointer */}
            {currentStep >= 0 && (
              <div
                className="gantt-pointer"
                style={{ left: `${currentStep * slotWidth}px` }}
              ></div>
            )}

            {/* Gantt slots */}
            <div className="gantt-bars">
              {timeline.map((slot, idx) => {
                const isVisible = currentStep >= slot.start;
                const isIdle = slot.pid === 'IDLE';
                const color = isIdle ? '#333' : pidColorMap[slot.pid] || '#555';
                const width = (slot.end - slot.start) * slotWidth;
                const isHighlighted =
                  highlightPid && slot.pid === highlightPid;

                return (
                  <div
                    key={`${slot.pid}-${slot.start}-${idx}`}
                    className={`gantt-slot ${isVisible ? 'gantt-slot-visible' : ''} ${isIdle ? 'gantt-slot-idle' : ''} ${isHighlighted ? 'gantt-slot-highlight' : ''}`}
                    style={{
                      left: `${slot.start * slotWidth}px`,
                      width: `${width}px`,
                      backgroundColor: isVisible ? color : 'transparent',
                      borderColor: isVisible ? color : '#1a1a1a',
                    }}
                    onMouseEnter={(e) =>
                      !isIdle && handleSlotHover(slot, e)
                    }
                    onMouseMove={(e) =>
                      !isIdle && handleSlotHover(slot, e)
                    }
                    onMouseLeave={handleMouseLeave}
                    onClick={() =>
                      !isIdle && setHighlightPid(
                        highlightPid === slot.pid ? null : slot.pid
                      )
                    }
                  >
                    {isVisible && (
                      <span className="gantt-slot-label">
                        {isIdle ? 'IDLE' : slot.pid}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Preemption markers */}
            {preemptions &&
              preemptions.map((p, idx) => (
                <div
                  key={`preempt-${idx}`}
                  className="preemption-marker"
                  style={{ left: `${p.at * slotWidth - 6}px` }}
                  onMouseEnter={(e) => handlePreemptionHover(p, e)}
                  onMouseMove={(e) => handlePreemptionHover(p, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  ↑
                </div>
              ))}

            {/* Time markers */}
            <div className="gantt-time-markers">
              {Array.from({ length: totalTime + 1 }, (_, i) => (
                <div
                  key={i}
                  className="gantt-time-mark"
                  style={{ left: `${i * slotWidth}px` }}
                >
                  {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Tooltip
        visible={tooltip.visible}
        content={tooltip.content}
        x={tooltip.x}
        y={tooltip.y}
      />
    </div>
  );
}
