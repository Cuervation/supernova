import { useEffect, useRef, useState } from "react";

type GameCountdownOverlayProps = {
  onComplete: () => void | Promise<void>;
};

const steps = ["3", "2", "1", "¡Arranca!"] as const;
const stepDurationMs = 750;

export function GameCountdownOverlay({ onComplete }: GameCountdownOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const timeoutsRef = useRef<number[]>([]);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    completedRef.current = false;
    setStepIndex(0);

    timeoutsRef.current = [
      window.setTimeout(() => setStepIndex(1), stepDurationMs),
      window.setTimeout(() => setStepIndex(2), stepDurationMs * 2),
      window.setTimeout(() => setStepIndex(3), stepDurationMs * 3),
      window.setTimeout(() => {
        if (completedRef.current) {
          return;
        }

        completedRef.current = true;
        void onCompleteRef.current();
      }, stepDurationMs * 4),
    ];

    return () => {
      for (const timeoutId of timeoutsRef.current) {
        window.clearTimeout(timeoutId);
      }

      timeoutsRef.current = [];
    };
  }, []);

  const activeLabel = steps[stepIndex] ?? steps[steps.length - 1];

  return (
    <div className="countdown-overlay" role="dialog" aria-modal="true" aria-label="Comenzando partida">
      <div className="countdown-overlay__halo countdown-overlay__halo--one" aria-hidden="true" />
      <div className="countdown-overlay__halo countdown-overlay__halo--two" aria-hidden="true" />
      <div className="countdown-overlay__content" aria-live="polite">
        <div className="countdown-overlay__value" data-step={activeLabel === "¡Arranca!" ? "launch" : "count"}>
          {activeLabel}
        </div>
      </div>
    </div>
  );
}
