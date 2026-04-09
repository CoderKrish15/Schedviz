import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ProcessTable from './components/ProcessTable';
import AlgorithmConfig from './components/AlgorithmConfig';
import GanttChart from './components/GanttChart';
import ReadyQueue from './components/ReadyQueue';
import StatsTable from './components/StatsTable';
import CompareChart from './components/CompareChart';
import { useScheduler } from './hooks/useScheduler';
import { useAnimation } from './hooks/useAnimation';
import { DEFAULT_PROCESSES } from './algorithms';

export default function App() {
  // Process table state
  const [processes, setProcesses] = useState(
    DEFAULT_PROCESSES.map((p) => ({ ...p }))
  );

  const [algorithm, setAlgorithm] = useState('FCFS');
  const [quantum, setQuantum] = useState(2);
  const [speed, setSpeed] = useState(500);
  const [errorMessage, setErrorMessage] = useState('');

  // Scheduler
  const {
    results,
    activeAlgorithm,
    setActiveAlgorithm,
    runAlgorithm,
    clearResults,
  } = useScheduler();

  // Current result for active algorithm
  const currentResult = activeAlgorithm ? results[activeAlgorithm] : null;

  // Animation
  const {
    currentStep,
    isPlaying,
    isComplete,
    totalSlots,
    currentProcess,
    play,
    pause,
    reset: resetAnimation,
  } = useAnimation(currentResult?.timeline, speed);

  // Highlight
  const [highlightPid, setHighlightPid] = useState(null);

  const handleRun = useCallback(() => {
    if (processes.length === 0) {
      setErrorMessage('NO PROCESSES DEFINED');
      setTimeout(() => setErrorMessage(''), 2000);
      return;
    }
    setErrorMessage('');
    setHighlightPid(null);

    const result = runAlgorithm(algorithm, processes, { quantum });
    if (result) {
      // Play will start after timeline is set via useEffect in useAnimation
      setTimeout(() => play(), 50);
    }
  }, [processes, algorithm, quantum, runAlgorithm, play]);

  const handleReset = useCallback(() => {
    clearResults();
    resetAnimation();
    setHighlightPid(null);
    setErrorMessage('');
  }, [clearResults, resetAnimation]);

  const handleRandomize = useCallback(() => {
    const count = Math.floor(Math.random() * 3) + 4; // 4-6 processes
    const randomProcs = Array.from({ length: count }, (_, i) => ({
      pid: `P${i + 1}`,
      arrival: Math.floor(Math.random() * 9),
      burst: Math.floor(Math.random() * 10) + 1,
      priority: Math.floor(Math.random() * 5) + 1,
    }));
    setProcesses(randomProcs);
    handleReset();
  }, [handleReset]);

  const handlePause = useCallback(() => {
    pause();
  }, [pause]);

  const handleReplay = useCallback(() => {
    play();
  }, [play]);

  // Tab switching
  const algorithmNames = Object.keys(results);
  const handleTabSwitch = useCallback(
    (algoName) => {
      setActiveAlgorithm(algoName);
      setHighlightPid(null);
    },
    [setActiveAlgorithm]
  );

  return (
    <div className="app">
      {/* CRT Scanline overlay */}
      <div className="crt-overlay"></div>
      <div className="noise-overlay"></div>

      <Header />

      <div className="app-layout">
        {/* Left Panel */}
        <aside className="left-panel">
          <ProcessTable processes={processes} setProcesses={setProcesses} />
          <AlgorithmConfig
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            quantum={quantum}
            setQuantum={setQuantum}
            speed={speed}
            setSpeed={setSpeed}
            onRun={handleRun}
            onReset={handleReset}
            onRandomize={handleRandomize}
            isPlaying={isPlaying}
            isComplete={isComplete}
            onPause={handlePause}
            onReplay={handleReplay}
            hasProcesses={processes.length > 0}
            errorMessage={errorMessage}
          />
        </aside>

        {/* Main Area */}
        <main className="main-area">
          {/* Algorithm Tabs */}
          {algorithmNames.length > 0 && (
            <div className="algo-tabs" id="algo-tabs">
              {algorithmNames.map((name) => (
                <button
                  key={name}
                  className={`algo-tab ${name === activeAlgorithm ? 'algo-tab-active' : ''}`}
                  onClick={() => handleTabSwitch(name)}
                  id={`tab-${name}`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          {/* Gantt Chart */}
          <GanttChart
            timeline={currentResult?.timeline}
            currentStep={currentStep}
            processes={processes}
            preemptions={currentResult?.preemptions}
            highlightPid={highlightPid}
            setHighlightPid={setHighlightPid}
          />

          {/* Ready Queue */}
          <ReadyQueue
            timeline={currentResult?.timeline}
            processes={currentResult?.processes}
            currentStep={currentStep}
            allProcesses={processes}
          />

          {/* Stats Table (shown when complete) */}
          {isComplete && currentResult && (
            <StatsTable
              result={currentResult}
              processes={processes}
            />
          )}

          {/* Comparison Chart */}
          <CompareChart results={results} />
        </main>
      </div>
    </div>
  );
}
