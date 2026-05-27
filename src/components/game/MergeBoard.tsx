import { useState, type PointerEvent } from "react";
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
          />
        );
      })}
    </div>
  );
}
