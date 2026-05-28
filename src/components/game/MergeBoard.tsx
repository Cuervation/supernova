import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
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

type BoardLayoutMode = "desktop" | "compact";

const fixedBoardLayout: Record<string, BoardPieceStyle> = {
  "principle-todo-terreno": {
    left: "5%",
    top: "8%",
    maxWidth: "20rem",
    width: "fit-content",
    "--piece-rotate": "-5deg",
  },
  "definition-todo-terreno": {
    left: "37%",
    top: "8%",
    maxWidth: "23rem",
    width: "fit-content",
    "--piece-rotate": "-3deg",
  },
  "principle-fan-cliente": {
    right: "5%",
    top: "9%",
    maxWidth: "20rem",
    width: "fit-content",
    "--piece-rotate": "4deg",
  },
  "definition-fan-cliente": {
    left: "5%",
    top: "32%",
    maxWidth: "23rem",
    width: "fit-content",
    "--piece-rotate": "3deg",
  },
  "principle-valentia-transforma": {
    left: "38%",
    top: "34%",
    maxWidth: "20rem",
    width: "fit-content",
    "--piece-rotate": "2deg",
  },
  "definition-valentia-transforma": {
    right: "5%",
    top: "32%",
    maxWidth: "23rem",
    width: "fit-content",
    "--piece-rotate": "-1deg",
  },
  "principle-inspiramos-huella": {
    left: "5%",
    top: "60%",
    maxWidth: "21rem",
    width: "fit-content",
    "--piece-rotate": "0deg",
  },
  "definition-inspiramos-huella": {
    left: "36%",
    top: "59%",
    maxWidth: "24rem",
    width: "fit-content",
    "--piece-rotate": "-1deg",
  },
  "principle-equipazo": {
    left: "62%",
    top: "60%",
    maxWidth: "18rem",
    width: "fit-content",
    "--piece-rotate": "3deg",
  },
  "definition-equipazo": {
    right: "2.5%",
    top: "56%",
    maxWidth: "23rem",
    width: "fit-content",
    "--piece-rotate": "3deg",
  },
};

const randomLayoutSlots: BoardPieceStyle[] = [
  { left: "5%", top: "7%" },
  { left: "37%", top: "7%" },
  { right: "5%", top: "8%" },
  { left: "5%", top: "32%" },
  { left: "38%", top: "33%" },
  { right: "5%", top: "32%" },
  { left: "5%", top: "59%" },
  { left: "36%", top: "58%" },
  { left: "62%", top: "59%" },
  { right: "2.5%", top: "55%" },
];

const compactRandomLayoutSlots: BoardPieceStyle[] = [
  { left: "2%", top: "0%" },
  { right: "2%", top: "1%" },
  { left: "2%", top: "20%" },
  { right: "2%", top: "21%" },
  { left: "2%", top: "40%" },
  { right: "2%", top: "41%" },
  { left: "2%", top: "60%" },
  { right: "2%", top: "61%" },
  { left: "2%", top: "80%" },
  { right: "2%", top: "81%" },
];

function getPieceSizing(itemId: string, layoutMode: BoardLayoutMode): BoardPieceStyle {
  const isDefinition = itemId.startsWith("definition-");

  if (layoutMode === "compact") {
    return {
      maxWidth: isDefinition ? "38%" : "34%",
      width: "fit-content",
    };
  }

  return {
    maxWidth: isDefinition ? "21.5rem" : "18.5rem",
    width: "fit-content",
  };
}

function hashString(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let next = state;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(values: T[], seed: number): T[] {
  const shuffled = [...values];
  const random = createSeededRandom(seed);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function getRandomRotation(itemId: string, layoutSeed: number): string {
  const maxRotation = Math.min(Math.abs(gameVisualConfig.maxCardRotationDeg), 29);
  const random = createSeededRandom(hashString(`${layoutSeed}:${itemId}:rotation`));
  const rotation = Math.round((random() * maxRotation * 2 - maxRotation) * 10) / 10;
  return `${rotation}deg`;
}

function createRandomBoardLayout(
  itemIds: string[],
  layoutSeed: number,
  layoutMode: BoardLayoutMode,
): Record<string, BoardPieceStyle> {
  const layoutSlots = layoutMode === "compact" ? compactRandomLayoutSlots : randomLayoutSlots;
  const shuffledSlots = shuffle(layoutSlots, hashString(`${layoutSeed}:${layoutMode}:slots`));

  return itemIds.reduce<Record<string, BoardPieceStyle>>((layout, itemId, index) => {
    const slot = shuffledSlots[index % shuffledSlots.length];
    layout[itemId] = {
      ...slot,
      ...getPieceSizing(itemId, layoutMode),
      "--piece-rotate": getRandomRotation(itemId, layoutSeed),
    };
    return layout;
  }, {});
}

function getInitialLayoutMode(): BoardLayoutMode {
  if (typeof window === "undefined") {
    return "desktop";
  }

  return window.innerWidth <= gameVisualConfig.compactBoardBreakpointPx ? "compact" : "desktop";
}

export function MergeBoard({
  items,
  selectedItemIds,
  errorItemIds,
  layoutSeed = 0,
  onSelectItem,
  onMergeItems,
}: MergeBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [layoutMode, setLayoutMode] = useState<BoardLayoutMode>(getInitialLayoutMode);

  useEffect(() => {
    const boardElement = boardRef.current;

    if (!boardElement || !gameVisualConfig.preserveBoardLayoutOnMobile) {
      return;
    }

    const measuredBoard = boardElement;

    function updateLayoutMode() {
      const { width } = measuredBoard.getBoundingClientRect();
      setLayoutMode(width <= gameVisualConfig.compactBoardBreakpointPx ? "compact" : "desktop");
    }

    updateLayoutMode();

    const resizeObserver = new ResizeObserver(updateLayoutMode);
    resizeObserver.observe(measuredBoard);

    return () => resizeObserver.disconnect();
  }, []);

  /**
   * layoutSeed cambia cuando empieza una partida nueva. Mientras el usuario juega,
   * el layout se mantiene estable para que las cards no salten cuando se completa un par.
   */
  const boardLayout = useMemo(() => {
    if (!gameVisualConfig.randomizeCardLayout) {
      return fixedBoardLayout;
    }

    return createRandomBoardLayout(
      items.map((item) => item.id),
      layoutSeed,
      layoutMode,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutMode, layoutSeed]);

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
      className={`merge-board merge-board--${layoutMode}`}
      ref={boardRef}
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
