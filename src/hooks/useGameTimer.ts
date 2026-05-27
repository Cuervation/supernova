import { useCallback, useEffect, useRef, useState } from "react";
import type { GameTimerState } from "../core/game/timer.types";

type GameTimer = GameTimerState & {
  start: () => void;
  stop: () => number;
  reset: () => void;
};

export function useGameTimer(): GameTimer {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startedAtRef = useRef<number | null>(null);
  const baseElapsedRef = useRef(0);
  const isRunningRef = useRef(false);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || startedAtRef.current === null) {
      return;
    }

    let frameId = 0;

    function tick(now: number) {
      if (startedAtRef.current !== null) {
        setElapsedMs(baseElapsedRef.current + now - startedAtRef.current);
      }
      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);

  const start = useCallback(() => {
    if (isRunningRef.current) {
      return;
    }

    startedAtRef.current = performance.now();
    isRunningRef.current = true;
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    if (!isRunningRef.current || startedAtRef.current === null) {
      return baseElapsedRef.current;
    }

    const nextElapsed = baseElapsedRef.current + performance.now() - startedAtRef.current;
    baseElapsedRef.current = nextElapsed;
    startedAtRef.current = null;
    isRunningRef.current = false;
    setElapsedMs(nextElapsed);
    setIsRunning(false);
    return nextElapsed;
  }, []);

  const reset = useCallback(() => {
    baseElapsedRef.current = 0;
    startedAtRef.current = isRunningRef.current ? performance.now() : null;
    setElapsedMs(0);
  }, []);

  return { elapsedMs, isRunning, start, stop, reset };
}
