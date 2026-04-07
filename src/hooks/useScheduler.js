import { useState, useCallback } from 'react';
import { fcfs, sjf, rr } from '../algorithms';

export function useScheduler() {
  const [results, setResults] = useState({}); // keyed by algorithm name
  const [activeAlgorithm, setActiveAlgorithm] = useState(null);

  const runAlgorithm = useCallback((algorithm, processes, options = {}) => {
    const procsCopy = processes.map((p) => ({ ...p }));
    let result;

    switch (algorithm) {
      case 'FCFS':
        result = fcfs(procsCopy);
        break;
      case 'SJF':
        result = sjf(procsCopy, false);
        break;
      case 'SRTF':
        result = sjf(procsCopy, true);
        break;
      case 'RR':
        result = rr(procsCopy, options.quantum || 2);
        break;
      default:
        return null;
    }

    setResults((prev) => ({ ...prev, [algorithm]: result }));
    setActiveAlgorithm(algorithm);
    return result;
  }, []);

  const clearResults = useCallback(() => {
    setResults({});
    setActiveAlgorithm(null);
  }, []);

  const getAlgorithmNames = useCallback(() => {
    return Object.keys(results);
  }, [results]);

  return {
    results,
    activeAlgorithm,
    setActiveAlgorithm,
    runAlgorithm,
    clearResults,
    getAlgorithmNames,
  };
}
