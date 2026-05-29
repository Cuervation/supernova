import { useEffect, useMemo, useRef, useState } from "react";

type GameCountdownOverlayProps = {
  onComplete: () => void | Promise<void>;
};

const steps = ["3", "2", "1", "?Arranca!"] as const;
const stepDurationMs = 750;

export function GameCountdownOverlay({ onComplete }: GameCountdownOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const completedRef = useRef(false);
  const activeLabel = useMemo(() => steps[stepIndex] ?? steps[steps.length - 1], [stepIndex]);

  useEffect(() => {
    completedRef.current = false;
    setStepIndex(0);

    const timers = steps.map((_, index) => window.setTimeout(() => setStepIndex(index), index * stepDurationMs));
    const completeTimer = window.setTimeout(() => {
      if (completedRef.current) {
        return;
      }

      completedRef.current = true;
      void onComplete();
    }, steps.length * stepDurationMs);

    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="countdown-overlay" role="dialog" aria-modal="true" aria-label="Comenzando partida">
      <div className="countdown-overlay__halo countdown-overlay__halo--one" aria-hidden="true" />
      <div className="countdown-overlay__halo countdown-overlay__halo--two" aria-hidden="true" />
      <div className="countdown-overlay__content" aria-live="polite">
        <div className="countdown-overlay__value" data-step={activeLabel === "?Arranca!" ? "launch" : "count"}>
          {activeLabel}
        </div>
      </div>
    </div>
  );
}
