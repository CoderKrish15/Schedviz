/**
 * SJF — Shortest Job First
 * Non-preemptive: pick shortest burst among arrived processes at each decision point.
 * Preemptive (SRTF): at every time unit, pick process with shortest remaining time.
 */
export function sjf(processes, preemptive = false) {
  const procs = processes.map((p) => ({
    ...p,
    remaining: p.burst,
    startTime: null,
    finishTime: null,
    responseTime: null,
    waitingTime: 0,
    turnaroundTime: 0,
  }));

  if (preemptive) {
    return srtf(procs);
  }
  return sjfNonPreemptive(procs);
}

function sjfNonPreemptive(procs) {
  const timeline = [];
  const completed = [];
  const remaining = [...procs];
  let currentTime = 0;

  while (remaining.length > 0) {
    // Get all arrived processes
    const available = remaining.filter((p) => p.arrival <= currentTime);

    if (available.length === 0) {
      // CPU idle — advance to next arrival
      const nextArrival = Math.min(...remaining.map((p) => p.arrival));
      timeline.push({ pid: 'IDLE', start: currentTime, end: nextArrival });
      currentTime = nextArrival;
      continue;
    }

    // Pick shortest burst, tie-break by PID
    available.sort((a, b) => a.burst - b.burst || a.pid.localeCompare(b.pid));
    const proc = available[0];

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

    const idx = remaining.indexOf(proc);
    remaining.splice(idx, 1);
  }

  return buildResult(completed, timeline, []);
}

function srtf(procs) {
  const timeline = [];
  const completed = [];
  const preemptions = [];
  let currentTime = 0;
  const maxTime = Math.max(...procs.map((p) => p.arrival)) + procs.reduce((s, p) => s + p.burst, 0);
  let prevPid = null;
  let slotStart = 0;

  while (completed.length < procs.length && currentTime <= maxTime) {
    // Available processes: arrived and have remaining burst
    const available = procs.filter((p) => p.arrival <= currentTime && p.remaining > 0);

    if (available.length === 0) {
      // Find next arrival among remaining processes
      const unfinished = procs.filter((p) => p.remaining > 0);
      if (unfinished.length === 0) break;
      const nextArrival = Math.min(...unfinished.map((p) => p.arrival));
      if (prevPid !== null) {
        timeline.push({ pid: prevPid, start: slotStart, end: currentTime });
        prevPid = null;
      }
      timeline.push({ pid: 'IDLE', start: currentTime, end: nextArrival });
      currentTime = nextArrival;
      slotStart = currentTime;
      continue;
    }

    // Pick process with shortest remaining time; tie-break by PID
    available.sort((a, b) => a.remaining - b.remaining || a.pid.localeCompare(b.pid));
    const proc = available[0];

    if (proc.pid !== prevPid) {
      // Save previous slot
      if (prevPid !== null) {
        timeline.push({ pid: prevPid, start: slotStart, end: currentTime });
        // Record preemption if old process isn't finished
        const prevProc = procs.find((p) => p.pid === prevPid);
        if (prevProc && prevProc.remaining > 0) {
          preemptions.push({ at: currentTime, preempted: prevPid, by: proc.pid });
        }
      }
      slotStart = currentTime;
      prevPid = proc.pid;
    }

    // Record response time on first run
    if (proc.responseTime === null) {
      proc.responseTime = currentTime - proc.arrival;
      proc.startTime = currentTime;
    }

    proc.remaining -= 1;
    currentTime += 1;

    // If process finishes
    if (proc.remaining === 0) {
      proc.finishTime = currentTime;
      proc.turnaroundTime = currentTime - proc.arrival;
      proc.waitingTime = proc.turnaroundTime - proc.burst;
      completed.push(proc);
      timeline.push({ pid: proc.pid, start: slotStart, end: currentTime });
      prevPid = null;
      slotStart = currentTime;
    }
  }

  // Flush last slot
  if (prevPid !== null) {
    timeline.push({ pid: prevPid, start: slotStart, end: currentTime });
  }

  return buildResult(completed, timeline, preemptions);
}

function buildResult(completed, timeline, preemptions) {
  const n = completed.length;
  const avgWaiting = n ? completed.reduce((s, p) => s + p.waitingTime, 0) / n : 0;
  const avgTurnaround = n ? completed.reduce((s, p) => s + p.turnaroundTime, 0) / n : 0;
  const avgResponse = n ? completed.reduce((s, p) => s + p.responseTime, 0) / n : 0;

  return {
    timeline,
    processes: completed.sort((a, b) => a.pid.localeCompare(b.pid)),
    avgWaiting: Math.round(avgWaiting * 100) / 100,
    avgTurnaround: Math.round(avgTurnaround * 100) / 100,
    avgResponse: Math.round(avgResponse * 100) / 100,
    preemptions,
  };
}
