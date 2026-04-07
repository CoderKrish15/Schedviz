import React, { useState, useEffect } from 'react';
import { PROCESS_COLORS } from '../algorithms';

function CountUp({ target, duration = 800 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.round(eased * target * 100) / 100);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return <span>{value.toFixed(2)}</span>;
}

export default function StatsTable({ result, processes: inputProcesses }) {
  if (!result) return null;

  const { processes, avgWaiting, avgTurnaround, avgResponse } = result;

  const pidColorMap = {};
  if (inputProcesses) {
    inputProcesses.forEach((p, i) => {
      pidColorMap[p.pid] = PROCESS_COLORS[i % PROCESS_COLORS.length];
    });
  }

  const getWaitingColor = (wt) => {
    if (wt < avgWaiting * 0.8) return '#00ff41';
    if (wt <= avgWaiting * 1.2) return '#ff6b35';
    return '#ff3f96';
  };

  return (
    <div className="terminal-panel" id="stats-table-panel">
      <div className="panel-header">
        <span className="panel-dots">●●●</span>
        <span className="panel-label">STATISTICS</span>
      </div>
      <div className="panel-body">
        <div className="stats-table-scroll">
          <table className="stats-table">
            <thead>
              <tr>
                <th>PID</th>
                <th>ARRIVAL</th>
                <th>BURST</th>
                <th>START</th>
                <th>FINISH</th>
                <th>WAITING</th>
                <th>TURNAROUND</th>
                <th>RESPONSE</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((proc) => (
                <tr key={proc.pid} id={`stat-row-${proc.pid}`}>
                  <td>
                    <span className="stat-pid">
                      <span
                        className="process-dot"
                        style={{
                          backgroundColor: pidColorMap[proc.pid] || '#555',
                        }}
                      ></span>
                      {proc.pid}
                    </span>
                  </td>
                  <td>
                    <CountUp target={proc.arrival} />
                  </td>
                  <td>
                    <CountUp target={proc.burst} />
                  </td>
                  <td>
                    <CountUp target={proc.startTime ?? 0} />
                  </td>
                  <td>
                    <CountUp target={proc.finishTime ?? 0} />
                  </td>
                  <td
                    style={{ color: getWaitingColor(proc.waitingTime) }}
                  >
                    <CountUp target={proc.waitingTime} />
                  </td>
                  <td>
                    <CountUp target={proc.turnaroundTime} />
                  </td>
                  <td>
                    <CountUp target={proc.responseTime ?? 0} />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="stats-avg-row">
                <td>AVG</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
                <td>
                  <CountUp target={avgWaiting} />
                </td>
                <td>
                  <CountUp target={avgTurnaround} />
                </td>
                <td>
                  <CountUp target={avgResponse} />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
