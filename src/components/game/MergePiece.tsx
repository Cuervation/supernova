import type { CSSProperties, PointerEvent } from "react";
import type { GameContentItem } from "../../core/game/game-content.types";

type MergePieceProps = {
  item: GameContentItem;
  isDragging: boolean;
  isSelected: boolean;
  hasError: boolean;
  dragOffset: { x: number; y: number };
  onPointerDown: (event: PointerEvent<HTMLButtonElement>, itemId: string) => void;
};

export function MergePiece({
  item,
  isDragging,
  isSelected,
  hasError,
  dragOffset,
  onPointerDown,
}: MergePieceProps) {
  const style: CSSProperties = isDragging
    ? { transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)` }
    : {};

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
      style={style}
      type="button"
    >
      <span className="merge-piece__type">{item.type === "principle" ? "Principio" : "Definición"}</span>
      <span className="merge-piece__text">{item.text}</span>
    </button>
  );
}
