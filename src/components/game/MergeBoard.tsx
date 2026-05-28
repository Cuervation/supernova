import { useMemo, useState, type CSSProperties, type PointerEvent } from "react";
import { gameVisualConfig } from "../../config/gameVisualConfig";
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
  layoutSeed?: number;
  onSelectItem: (itemId: string) => void;
  onMergeItems: (sourceId: string, targetId: string) => MergeResult;
};

type BoardPieceStyle = CSSProperties & {
  "--piece-rotate"?: string;
};

const fixedBoardLayout: Record<string, BoardPieceStyle> = {
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

const randomLayoutSlots: BoardPieceStyle[] = [
  { left: "6%", top: "7%", width: "24rem" },
  { left: "35.5%", top: "7%", width: "23rem" },
  { right: "7%", top: "8%", width: "24rem" },
  { left: "5.5%", top: "31%", width: "23rem" },
  { left: "39%", top: "33%", width: "22.5rem" },
  { right: "6%", top: "31%", width: "23.5rem" },
  { left: "4%", top: "59%", width: "23rem" },
  { left: "29%", top: "58%", width: "24rem" },
  { left: "55%", top: "59%", width: "22rem" },
  { right: "2.5%", top: "55%", width: "23.5rem" },
];

function shuffle<T>(values: T[]): T[] {
  const shuffled = [...values];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function getRandomRotation(): string {
  const maxRotation = Math.min(Math.abs(gameVisualConfig.maxCardRotationDeg), 29);
  const rotation = Math.round((Math.random() * maxRotation * 2 - maxRotation) * 10) / 10;
  return `${rotation}deg`;
}

function createRandomBoardLayout(itemIds: string[]): Record<string, BoardPieceStyle> {
  const shuffledSlots = shuffle(randomLayoutSlots);

  return itemIds.reduce<Record<string, BoardPieceStyle>>((layout, itemId, index) => {
    const slot = shuffledSlots[index % shuffledSlots.length];
    layout[itemId] = {
      ...slot,
      "--piece-rotate": getRandomRotation(),
    };
    return layout;
  }, {});
}

export function MergeBoard({
  items,
  selectedItemIds,
  errorItemIds,
  layoutSeed = 0,
  onSelectItem,
  onMergeItems,
}: MergeBoardProps) {
  const [dragState, setDragState] = useState<DragState | null>(null);

  /**
   * layoutSeed cambia cuando empieza una partida nueva. Mientras el usuario juega,
   * el layout se mantiene estable para que las cards no salten cuando se completa un par.
   */
  const boardLayout = useMemo(() => {
    if (!gameVisualConfig.randomizeCardLayout) {
      return fixedBoardLayout;
    }

    return createRandomBoardLayout(items.map((item) => item.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutSeed]);

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
