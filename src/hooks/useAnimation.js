import { useState, useRef, useCallback, useEffect } from 'react';

export function useAnimation(timeline, speed = 500) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef(null);
  const stepRef = useRef(-1);

  const totalSlots = timeline
    ? timeline.reduce((max, slot) => Math.max(max, slot.end), 0)
    : 0;

  const play = useCallback(() => {
    if (!timeline || timeline.length === 0) return;

    if (isComplete) {
      // Replay from start
      stepRef.current = -1;
      setCurrentStep(-1);
      setIsComplete(false);
    }

    setIsPlaying(true);
  }, [timeline, isComplete]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setIsComplete(false);
    setCurrentStep(-1);
    stepRef.current = -1;
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isPlaying || !timeline) return;

    let lastTime = performance.now();

    const tick = (now) => {
      const elapsed = now - lastTime;
      if (elapsed >= speed) {
        lastTime = now;
        stepRef.current += 1;

        if (stepRef.current >= totalSlots) {
          setCurrentStep(totalSlots);
          setIsPlaying(false);
          setIsComplete(true);
          return;
        }

        setCurrentStep(stepRef.current);
      }
      timerRef.current = requestAnimationFrame(tick);
    };

    timerRef.current = requestAnimationFrame(tick);

    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, [isPlaying, speed, timeline, totalSlots]);

  // Reset when timeline changes
  useEffect(() => {
    reset();
  }, [timeline, reset]);

  // Get the currently running process at currentStep
  const currentProcess = timeline
    ? timeline.find((slot) => currentStep >= slot.start && currentStep < slot.end)
    : null;

  return {
    currentStep,
    isPlaying,
    isComplete,
    totalSlots,
    currentProcess,
    play,
    pause,
    reset,
  };
}
