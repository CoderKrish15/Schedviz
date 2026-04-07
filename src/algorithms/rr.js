/**
 * RR — Round Robin
 * Cycles through processes in a queue with a fixed time quantum.
 */
export function rr(processes, quantum = 2) {
  const procs = processes.map((p) => ({
    ...p,
    remaining: p.burst,
    startTime: null,
    finishTime: null,
    responseTime: null,
    waitingTime: 0,
    turnaroundTime: 0,
  }));

  const timeline = [];
  const completed = [];
  const preemptions = [];
  const queue = [];
  let currentTime = 0;

  // Sort by arrival, then PID for initial ordering
  const sorted = [...procs].sort(
    (a, b) => a.arrival - b.arrival || a.pid.localeCompare(b.pid)
  );

  // Add all processes arriving at time 0
  for (const p of sorted) {
    if (p.arrival <= currentTime) {
      queue.push(p);
    }
  }

  const maxTime =
    Math.max(...procs.map((p) => p.arrival)) +
    procs.reduce((s, p) => s + p.burst, 0);

  while (completed.length < procs.length && currentTime <= maxTime) {
    if (queue.length === 0) {
      // Find next arriving process
      const unfinished = procs.filter(
        (p) => p.remaining > 0 && !queue.includes(p)
      );
      if (unfinished.length === 0) break;
      const nextArrival = Math.min(...unfinished.map((p) => p.arrival));
      timeline.push({ pid: 'IDLE', start: currentTime, end: nextArrival });
      currentTime = nextArrival;

      // Enqueue newly arrived
      for (const p of sorted) {
        if (
          p.arrival <= currentTime &&
          p.remaining > 0 &&
          !queue.includes(p) &&
          !completed.includes(p)
        ) {
          queue.push(p);
        }
      }
      continue;
    }

    const proc = queue.shift();

    // Record response time on first run
    if (proc.responseTime === null) {
      proc.responseTime = currentTime - proc.arrival;
      proc.startTime = currentTime;
    }

    const runTime = Math.min(quantum, proc.remaining);
    const start = currentTime;
    const end = start + runTime;

    timeline.push({ pid: proc.pid, start, end });

    proc.remaining -= runTime;
    currentTime = end;

    // Enqueue any newly arrived processes (arrive during this burst)
    // They arrive BEFORE the current process is re-enqueued
    for (const p of sorted) {
      if (
        p.arrival > start &&
        p.arrival <= currentTime &&
        p.remaining > 0 &&
        !queue.includes(p) &&
        !completed.includes(p) &&
        p !== proc
      ) {
        queue.push(p);
      }
    }

    if (proc.remaining === 0) {
      // Process completed
      proc.finishTime = currentTime;
      proc.turnaroundTime = currentTime - proc.arrival;
      proc.waitingTime = proc.turnaroundTime - proc.burst;
      completed.push(proc);
    } else {
      // Process not done — preempted, re-add to queue
      queue.push(proc);
      preemptions.push({
        at: currentTime,
        preempted: proc.pid,
        by: queue.length > 0 ? queue[0].pid : proc.pid,
      });
    }
  }

  const n = completed.length;
  const avgWaiting = n
    ? completed.reduce((s, p) => s + p.waitingTime, 0) / n
    : 0;
  const avgTurnaround = n
    ? completed.reduce((s, p) => s + p.turnaroundTime, 0) / n
    : 0;
  const avgResponse = n
    ? completed.reduce((s, p) => s + p.responseTime, 0) / n
    : 0;

  return {
    timeline,
    processes: completed.sort((a, b) => a.pid.localeCompare(b.pid)),
    avgWaiting: Math.round(avgWaiting * 100) / 100,
    avgTurnaround: Math.round(avgTurnaround * 100) / 100,
    avgResponse: Math.round(avgResponse * 100) / 100,
    preemptions,
  };
}
