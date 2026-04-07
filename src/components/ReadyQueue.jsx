import React from 'react';
import { PROCESS_COLORS } from '../algorithms';

export default function ReadyQueue({
  timeline,
  processes,
  currentStep,
  allProcesses,
}) {
  if (!timeline || !allProcesses || currentStep < 0) {
    return null;
  }

  const pidColorMap = {};
  allProcesses.forEach((p, i) => {
    pidColorMap[p.pid] = PROCESS_COLORS[i % PROCESS_COLORS.length];
  });

  // Determine the currently running process
  const runningSlot = timeline.find(
    (slot) => currentStep >= slot.start && currentStep < slot.end
  );
  const runningPid = runningSlot && runningSlot.pid !== 'IDLE' ? runningSlot.pid : null;

  // Determine which processes have completed by currentStep
  const completedPids = new Set();
  if (processes) {
    processes.forEach((p) => {
      if (p.finishTime !== null && p.finishTime <= currentStep) {
        completedPids.add(p.pid);
      }
    });
  }

  // Determine which processes have arrived and are waiting
  const arrivedPids = allProcesses
    .filter((p) => p.arrival <= currentStep)
    .map((p) => p.pid);

  const waitingPids = arrivedPids.filter(
    (pid) => pid !== runningPid && !completedPids.has(pid)
  );

  // Processes not yet arrived
  const notArrivedPids = allProcesses
    .filter((p) => p.arrival > currentStep)
    .map((p) => p.pid);

  return (
    <div className="terminal-panel" id="ready-queue-panel">
      <div className="panel-header">
        <span className="panel-dots">●●●</span>
        <span className="panel-label">READY_QUEUE</span>
      </div>
      <div className="panel-body">
        <div className="queue-container">
          {/* Waiting Queue */}
          <div className="queue-section">
            <span className="queue-label">QUEUE:</span>
            <div className="queue-chips">
              {waitingPids.length === 0 && (
                <span className="queue-empty">— empty —</span>
              )}
              {waitingPids.map((pid) => (
                <div
                  key={pid}
                  className="queue-chip queue-chip-waiting"
                  style={{ borderColor: pidColorMap[pid] }}
                >
                  <span
                    className="chip-dot"
                    style={{ backgroundColor: pidColorMap[pid] }}
                  ></span>
                  {pid}
                </div>
              ))}
            </div>
          </div>

          {/* Running */}
          <div className="queue-section">
            {runningPid ? (
              <div
                className="queue-chip queue-chip-running"
                style={{ borderColor: pidColorMap[runningPid] }}
              >
                <span className="running-icon">⚙</span>
                {runningPid}
                <span className="running-badge">RUNNING</span>
              </div>
            ) : (
              <div className="queue-chip queue-chip-idle">
                <span className="idle-badge">IDLE</span>
              </div>
            )}
          </div>

          {/* Completed */}
          {completedPids.size > 0 && (
            <div className="queue-section">
              <span className="queue-label">DONE:</span>
              <div className="queue-chips">
                {Array.from(completedPids).map((pid) => (
                  <div
                    key={pid}
                    className="queue-chip queue-chip-done"
                    style={{ borderColor: pidColorMap[pid], opacity: 0.6 }}
                  >
                    <span className="done-icon">✓</span>
                    {pid}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
