import { useEffect, useState } from "react";
import { BrandButton } from "../ui/BrandButton";
import { BrandCard } from "../ui/BrandCard";

type TutorialMergeModalProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

export function TutorialMergeModal({ onCancel, onConfirm }: TutorialMergeModalProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const update = () => setIsTouchDevice(mediaQuery.matches || "ontouchstart" in window);

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onCancel]);

  return (
    <div className="tutorial-merge-modal-backdrop" role="presentation" onClick={onCancel}>
      <BrandCard
        className="tutorial-merge-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-merge-title"
        aria-describedby="tutorial-merge-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="tutorial-merge-modal__content">
          <header className="tutorial-merge-modal__header">
            <h2 id="tutorial-merge-title">Cómo jugar</h2>
            <p id="tutorial-merge-description">Arrastrá un principio sobre su definición para unirlos.</p>
          </header>

          <div className="tutorial-merge-modal__demo" aria-hidden="true">
            <div className="tutorial-merge-modal__track">
              <div className="tutorial-merge-modal__link-line" />
              <div className="tutorial-merge-modal__card tutorial-merge-modal__card--principle">
                <span className="tutorial-merge-modal__label">PRINCIPIO</span>
                <strong>Equipazo</strong>
              </div>

              <div className="tutorial-merge-modal__card tutorial-merge-modal__card--definition">
                <span className="tutorial-merge-modal__label">DEFINICIÓN</span>
                <strong>Trabajamos en equipo para lograr más.</strong>
              </div>

              <div className={`tutorial-merge-modal__pointer tutorial-merge-modal__pointer--${isTouchDevice ? "touch" : "desktop"}`}>
                {isTouchDevice ? <FingerIcon /> : <DesktopDragHint />}
              </div>
            </div>
          </div>

          <div className="tutorial-merge-modal__actions">
            <BrandButton autoFocus onClick={onConfirm}>
              OK
            </BrandButton>
          </div>
        </div>
      </BrandCard>
    </div>
  );
}

function DesktopDragHint() {
  return (
    <div className="tutorial-merge-modal__desktop-hint">
      <div className="tutorial-merge-modal__cursor-shell">
        <svg viewBox="0 0 64 64" className="tutorial-merge-modal__icon" aria-hidden="true">
          <path d="M10 8.5 27.5 48l5.6-14.3 12.7 5.2L10 8.5Z" fill="currentColor" />
          <path d="M27.2 34.3 31 44.4l3.2-7.9 8.6 3.4-15.6-5.6Z" fill="rgba(255,255,255,0.28)" />
        </svg>
      </div>
      <div className="tutorial-merge-modal__mouse-hint" aria-hidden="true">
        <svg viewBox="0 0 64 64" className="tutorial-merge-modal__mouse-svg">
          <rect x="18" y="10" width="28" height="44" rx="14" fill="currentColor" />
          <path d="M32 10v18" stroke="rgba(255,255,255,0.75)" strokeLinecap="round" strokeWidth="3.2" />
          <rect className="tutorial-merge-modal__mouse-button" x="18" y="10" width="14" height="22" rx="14" fill="rgba(255,255,255,0.16)" />
        </svg>
        <span className="tutorial-merge-modal__mouse-text tutorial-merge-modal__mouse-text--desktop">Mantené apretado</span>
      </div>
    </div>
  );
}

function FingerIcon() {
  return (
    <div className="tutorial-merge-modal__touch-hint">
      <svg viewBox="0 0 64 64" className="tutorial-merge-modal__icon" aria-hidden="true">
        <path
          d="M26 12c2.4 0 4 1.9 4 4.3v14.7c0-2.8 1.9-4.7 4.2-4.7 2.4 0 4.3 1.9 4.3 4.3v4.7c0-2.2 1.9-4 4.1-4 2.4 0 4.3 1.9 4.3 4.3v10.2c0 8.1-6.5 14.2-14.7 14.2h-4.2c-8.3 0-15-6.7-15-15V24.2c0-2.4 1.9-4.3 4.3-4.3 2.1 0 3.9 1.4 4.3 3.4V16.3c0-2.4 1.9-4.3 4.4-4.3Z"
          fill="currentColor"
        />
        <path d="M24 16.5c0-2 1.7-3.7 3.8-3.7s3.8 1.7 3.8 3.7v20" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
