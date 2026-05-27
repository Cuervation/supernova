import { useMemo, useState } from "react";
import type { GameContent, GameContentItem, GamePair } from "../core/game/game-content.types";
import { areItemsCompleted, getAvailableItems, resolveMerge, type MergeResult } from "../core/game/mergeRules";
import { gameContent } from "../content/gameContent";

type MergeGameState = {
  content: GameContent;
  availableItems: GameContentItem[];
  selectedItems: GameContentItem[];
  completedPairs: GamePair[];
  lastFeedback: MergeFeedback | null;
  totalPairs: 5;
  isComplete: boolean;
  selectItem: (itemId: string) => void;
  mergeItems: (sourceId: string, targetId: string) => MergeResult;
  isItemCompleted: (itemId: string) => boolean;
  isItemSelected: (itemId: string) => boolean;
  clearFeedback: () => void;
  resetGame: () => void;
};

export type MergeFeedback =
  | { type: "correct"; itemIds: string[]; pairId: string }
  | { type: "incorrect"; itemIds: string[] };

export function useMergeGame(content: GameContent = gameContent): MergeGameState {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [completedPairIds, setCompletedPairIds] = useState<string[]>([]);
  const [lastFeedback, setLastFeedback] = useState<MergeFeedback | null>(null);

  const selectedItems = useMemo(
    () => selectedIds.map((id) => content.items.find((item) => item.id === id)).filter(Boolean) as GameContentItem[],
    [content.items, selectedIds],
  );

  const availableItems = useMemo(
    () => getAvailableItems(content, completedPairIds),
    [completedPairIds, content],
  );

  const completedPairs = useMemo(
    () => completedPairIds.map((id) => content.pairs.find((pair) => pair.id === id)).filter(Boolean) as GamePair[],
    [completedPairIds, content.pairs],
  );

  function isItemCompleted(itemId: string): boolean {
    return areItemsCompleted(content, completedPairIds, itemId);
  }

  function isItemSelected(itemId: string): boolean {
    return selectedIds.includes(itemId);
  }

  function mergeItems(sourceId: string, targetId: string): MergeResult {
    const result = resolveMerge(content, completedPairIds, sourceId, targetId);

    if (result.status === "correct") {
      setCompletedPairIds((currentPairIds) =>
        currentPairIds.includes(result.pair.id) ? currentPairIds : [...currentPairIds, result.pair.id],
      );
      setSelectedIds([]);
      setLastFeedback({ type: "correct", itemIds: [sourceId, targetId], pairId: result.pair.id });
      return result;
    }

    if (result.status === "incorrect") {
      setSelectedIds([]);
      setLastFeedback({ type: "incorrect", itemIds: [sourceId, targetId] });
      return result;
    }

    return result;
  }

  function selectItem(itemId: string) {
    if (isItemCompleted(itemId)) {
      return;
    }

    const nextSelection = selectedIds.includes(itemId)
      ? selectedIds.filter((id) => id !== itemId)
      : [...selectedIds, itemId].slice(-2);

    if (nextSelection.length < 2) {
      setSelectedIds(nextSelection);
      return;
    }

    mergeItems(nextSelection[0], nextSelection[1]);
  }

  function clearFeedback() {
    setLastFeedback(null);
  }

  function resetGame() {
    setSelectedIds([]);
    setCompletedPairIds([]);
    setLastFeedback(null);
  }

  return {
    content,
    availableItems,
    selectedItems,
    completedPairs,
    lastFeedback,
    totalPairs: content.totalPairs,
    isComplete: completedPairs.length === content.totalPairs,
    selectItem,
    mergeItems,
    isItemCompleted,
    isItemSelected,
    clearFeedback,
    resetGame,
  };
}
