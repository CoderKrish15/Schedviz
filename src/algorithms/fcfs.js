/**
 * FCFS — First Come First Serve (non-preemptive)
 * Processes are executed in order of arrival time.
 * Tie-break by PID.
 */
export function fcfs(processes) {
  const procs = processes
    .map((p) => ({ ...p, remaining: p.burst }))
    .sort((a, b) => a.arrival - b.arrival || a.pid.localeCompare(b.pid));

  const timeline = [];
  const completed = [];
  let currentTime = 0;

  for (const proc of procs) {
    // If CPU is idle before this process arrives, insert idle block
    if (currentTime < proc.arrival) {
      timeline.push({ pid: 'IDLE', start: currentTime, end: proc.arrival });
      currentTime = proc.arrival;
    }

    const start = currentTime;
    const end = start + proc.burst;

    timeline.push({ pid: proc.pid, start, end });

    proc.startTime = start;
    proc.finishTime = end;
    proc.responseTime = start - proc.arrival;
    proc.turnaroundTime = end - proc.arrival;
    proc.waitingTime = proc.turnaroundTime - proc.burst;
    proc.remaining = 0;

    completed.push(proc);
    currentTime = end;
  }

  const n = completed.length;
  const avgWaiting = n ? completed.reduce((s, p) => s + p.waitingTime, 0) / n : 0;
  const avgTurnaround = n ? completed.reduce((s, p) => s + p.turnaroundTime, 0) / n : 0;
  const avgResponse = n ? completed.reduce((s, p) => s + p.responseTime, 0) / n : 0;

  return {
    timeline,
    processes: completed,
    avgWaiting: Math.round(avgWaiting * 100) / 100,
    avgTurnaround: Math.round(avgTurnaround * 100) / 100,
    avgResponse: Math.round(avgResponse * 100) / 100,
    preemptions: [],
  };
}
