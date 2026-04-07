import React from 'react';
import { PROCESS_COLORS } from '../algorithms';

export default function ProcessTable({ processes, setProcesses, maxProcesses = 8 }) {
  const handleChange = (index, field, value) => {
    const numVal = parseInt(value, 10);
    if (isNaN(numVal) || numVal < 0) return;
    if (field === 'burst' && numVal === 0) return;

    setProcesses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: numVal };
      return updated;
    });
  };

  const addProcess = () => {
    if (processes.length >= maxProcesses) return;
    const nextId = processes.length + 1;
    // Find next available PID
    let pid = `P${nextId}`;
    const existingPids = new Set(processes.map((p) => p.pid));
    let counter = nextId;
    while (existingPids.has(pid)) {
      counter++;
      pid = `P${counter}`;
    }
    setProcesses((prev) => [
      ...prev,
      { pid, arrival: 0, burst: 1, priority: 1 },
    ]);
  };

  const removeProcess = (index) => {
    setProcesses((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="terminal-panel" id="process-table-panel">
      <div className="panel-header">
        <span className="panel-dots">●●●</span>
        <span className="panel-label">PROCESS_TABLE</span>
      </div>
      <div className="panel-body">
        <table className="process-table">
          <thead>
            <tr>
              <th></th>
              <th>PID</th>
              <th>ARRIVAL</th>
              <th>BURST</th>
              <th>PRIORITY</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {processes.map((proc, index) => (
              <tr key={proc.pid} id={`process-row-${proc.pid}`}>
                <td>
                  <span
                    className="process-dot"
                    style={{
                      backgroundColor:
                        PROCESS_COLORS[index % PROCESS_COLORS.length],
                    }}
                  ></span>
                </td>
                <td className="pid-cell">{proc.pid}</td>
                <td>
                  <input
                    type="number"
                    className="table-input"
                    value={proc.arrival}
                    min="0"
                    onChange={(e) =>
                      handleChange(index, 'arrival', e.target.value)
                    }
                    id={`input-arrival-${proc.pid}`}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="table-input"
                    value={proc.burst}
                    min="1"
                    onChange={(e) =>
                      handleChange(index, 'burst', e.target.value)
                    }
                    id={`input-burst-${proc.pid}`}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="table-input"
                    value={proc.priority}
                    min="1"
                    onChange={(e) =>
                      handleChange(index, 'priority', e.target.value)
                    }
                    id={`input-priority-${proc.pid}`}
                  />
                </td>
                <td>
                  {processes.length > 1 && (
                    <button
                      className="btn-delete"
                      onClick={() => removeProcess(index)}
                      title="Remove process"
                      id={`btn-delete-${proc.pid}`}
                    >
                      ✕
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {processes.length < maxProcesses && (
          <button className="btn-add" onClick={addProcess} id="btn-add-process">
            + Add Process
          </button>
        )}
      </div>
    </div>
  );
}
