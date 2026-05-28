import { useState, type CSSProperties, type PointerEvent } from "react";
import type { GameContentItem } from "../../core/game/game-content.types";
import type { MergeResult } from "../../core/game/mergeRules";
import { MergePiece } from "./MergePiece";

type DragState = {
  itemId: string;
  pointerId: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
};

type MergeBoardProps = {
  items: GameContentItem[];
  selectedItemIds: string[];
  errorItemIds: string[];
  onSelectItem: (itemId: string) => void;
  onMergeItems: (sourceId: string, targetId: string) => MergeResult;
};

type BoardPieceStyle = CSSProperties & {
  "--piece-rotate"?: string;
};

const boardLayout: Record<string, BoardPieceStyle> = {
  "principle-todo-terreno": {
    left: "7%",
    top: "8%",
    width: "24rem",
    "--piece-rotate": "-5deg",
  },
  "definition-todo-terreno": {
    left: "35.5%",
    top: "8%",
    width: "23rem",
    "--piece-rotate": "-3deg",
  },
  "principle-fan-cliente": {
    right: "7.5%",
    top: "9%",
    width: "24rem",
    "--piece-rotate": "4deg",
  },
  "definition-fan-cliente": {
    left: "6%",
    top: "32%",
    width: "23rem",
    "--piece-rotate": "3deg",
  },
  "principle-valentia-transforma": {
    left: "39%",
    top: "34%",
    width: "22rem",
    "--piece-rotate": "2deg",
  },
  "definition-valentia-transforma": {
    right: "6.5%",
    top: "32%",
    width: "23.5rem",
    "--piece-rotate": "-1deg",
  },
  "principle-inspiramos-huella": {
    left: "4%",
    top: "60%",
    width: "23rem",
    "--piece-rotate": "0deg",
  },
  "definition-inspiramos-huella": {
    left: "28.5%",
    top: "59%",
    width: "24rem",
    "--piece-rotate": "-1deg",
  },
  "principle-equipazo": {
    left: "55%",
    top: "60%",
    width: "22rem",
    "--piece-rotate": "3deg",
  },
  "definition-equipazo": {
    right: "2%",
    top: "56%",
    width: "23.5rem",
    "--piece-rotate": "3deg",
  },
};

export function MergeBoard({ items, selectedItemIds, errorItemIds, onSelectItem, onMergeItems }: MergeBoardProps) {
  const [dragState, setDragState] = useState<DragState | null>(null);

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>, itemId: string) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragState({
      itemId,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      currentX: event.clientX,
      currentY: event.clientY,
    });
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    setDragState((current) => {
      if (!current || current.pointerId !== event.pointerId) {
        return current;
      }

      return { ...current, currentX: event.clientX, currentY: event.clientY };
    });
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const dropTarget = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>("[data-merge-piece-id]");
    const targetId = dropTarget?.dataset.mergePieceId;
    const movedDistance = Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY);

    if (targetId && targetId !== dragState.itemId) {
      onMergeItems(dragState.itemId, targetId);
    } else if (movedDistance < 8) {
      onSelectItem(dragState.itemId);
    }

    setDragState(null);
  }

  function handlePointerCancel() {
    setDragState(null);
  }

  return (
    <div
      className="merge-board"
      onPointerCancel={handlePointerCancel}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {items.map((item) => {
        const isDragging = dragState?.itemId === item.id;
        return (
          <MergePiece
            dragOffset={{
              x: isDragging ? dragState.currentX - dragState.startX : 0,
              y: isDragging ? dragState.currentY - dragState.startY : 0,
            }}
            hasError={errorItemIds.includes(item.id)}
            isDragging={isDragging}
            isSelected={selectedItemIds.includes(item.id)}
            item={item}
            key={item.id}
            onPointerDown={handlePointerDown}
            style={boardLayout[item.id]}
          />
        );
      })}
    </div>
  );
}
