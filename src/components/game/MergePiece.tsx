import type { CSSProperties, PointerEvent, ReactNode } from "react";
import type { GameContentItem } from "../../core/game/game-content.types";

type MergePieceProps = {
  item: GameContentItem;
  isDragging: boolean;
  isSelected: boolean;
  hasError: boolean;
  dragOffset: { x: number; y: number };
  onPointerDown: (event: PointerEvent<HTMLButtonElement>, itemId: string) => void;
  style?: CSSProperties;
};

type PieceStyle = CSSProperties & {
  "--drag-x"?: string;
  "--drag-y"?: string;
};

function DefinitionIcon({ itemId }: { itemId: string }) {
  const icon: ReactNode = (() => {
    if (itemId.includes("todo-terreno")) {
      return (
        <>
          <path d="M20 38c6-8 14-10 20-6s12 2 18-6" />
          <path d="M38 28v28" />
          <path d="M38 28c8-8 18-5 22 2-8 0-14 2-22-2Z" />
        </>
      );
    }

    if (itemId.includes("fan-cliente")) {
      return (
        <>
          <circle cx="28" cy="26" r="8" />
          <circle cx="48" cy="28" r="7" />
          <path d="M14 58c3-12 11-18 22-18s19 6 22 18" />
          <path d="M42 45c5-5 13-6 20-2 5 3 8 8 9 15" />
        </>
      );
    }

    if (itemId.includes("valentia-transforma")) {
      return (
        <>
          <path d="M28 48c2-14 10-23 22-28 7 11 6 23-2 34" />
          <path d="M29 48c7 3 14 5 21 6" />
          <path d="M26 55c-5 2-9 6-12 12 7-1 12-4 16-9" />
        </>
      );
    }

    if (itemId.includes("inspiramos-huella")) {
      return (
        <>
          <path d="M22 60c7-14 17-24 31-30" />
          <path d="M52 30h12v12" />
          <path d="M30 56c8 0 13-3 18-9" />
        </>
      );
    }

    return (
      <>
        <circle cx="38" cy="28" r="6" />
        <circle cx="24" cy="38" r="5" />
        <circle cx="52" cy="38" r="5" />
        <path d="M14 60c4-9 11-14 20-14s16 5 20 14" />
        <path d="M42 53c4-5 9-7 15-7 8 0 14 5 17 14" />
        <path d="M10 60c3-7 8-11 15-12" />
      </>
    );
  })();

  return (
    <svg aria-hidden="true" className="merge-piece__svg-icon" fill="none" viewBox="0 0 78 78">
      {icon}
    </svg>
  );
}

export function MergePiece({
  item,
  isDragging,
  isSelected,
  hasError,
  dragOffset,
  onPointerDown,
  style,
}: MergePieceProps) {
  const pieceStyle: PieceStyle = {
    ...style,
    "--drag-x": `${dragOffset.x}px`,
    "--drag-y": `${dragOffset.y}px`,
  };

  return (
    <button
      className={[
        "merge-piece",
        `merge-piece--${item.type}`,
        isDragging ? "merge-piece--dragging" : "",
        isSelected ? "merge-piece--selected" : "",
        hasError ? "merge-piece--error" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-merge-piece-id={item.id}
      data-testid={`merge-piece-${item.id}`}
      onPointerDown={(event) => onPointerDown(event, item.id)}
      style={pieceStyle}
      type="button"
    >
      <span className="merge-piece__icon" aria-hidden="true">
        {item.type === "principle" && item.iconSrc ? (
          <img src={item.iconSrc} alt="" draggable={false} />
        ) : (
          <DefinitionIcon itemId={item.id} />
        )}
      </span>

      <span className="merge-piece__content">
        <span className="merge-piece__type">{item.type === "principle" ? "PRINCIPIO" : "DEFINICIÓN"}</span>
        <span className="merge-piece__text">{item.text}</span>
      </span>

      <span className="merge-piece__dots" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}
