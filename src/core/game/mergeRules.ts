import type { GameContent, GameContentItem, GamePair } from "./game-content.types";

export type MergeResult =
  | { status: "correct"; pair: GamePair }
  | { status: "incorrect" }
  | { status: "ignored" };

export function getPairForItem(content: GameContent, itemId: string): GamePair | null {
  return content.pairs.find((pair) => pair.principleId === itemId || pair.definitionId === itemId) ?? null;
}

export function areItemsCompleted(content: GameContent, completedPairIds: string[], itemId: string): boolean {
  const pair = getPairForItem(content, itemId);
  return pair ? completedPairIds.includes(pair.id) : false;
}

export function getAvailableItems(content: GameContent, completedPairIds: string[]): GameContentItem[] {
  return content.items.filter((item) => !areItemsCompleted(content, completedPairIds, item.id));
}

export function resolveMerge(content: GameContent, completedPairIds: string[], sourceId: string, targetId: string): MergeResult {
  if (sourceId === targetId) {
    return { status: "ignored" };
  }

  if (!hasItem(content, sourceId) || !hasItem(content, targetId)) {
    return { status: "ignored" };
  }

  if (areItemsCompleted(content, completedPairIds, sourceId) || areItemsCompleted(content, completedPairIds, targetId)) {
    return { status: "ignored" };
  }

  const matchedPair = content.pairs.find(
    (pair) =>
      !completedPairIds.includes(pair.id) &&
      ((pair.principleId === sourceId && pair.definitionId === targetId) ||
        (pair.principleId === targetId && pair.definitionId === sourceId)),
  );

  return matchedPair ? { status: "correct", pair: matchedPair } : { status: "incorrect" };
}

function hasItem(content: GameContent, itemId: string): boolean {
  return content.items.some((item) => item.id === itemId);
}
