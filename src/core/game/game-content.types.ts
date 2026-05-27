export type GameItemType = "principle" | "definition";

export type GameContentItem = {
  id: string;
  type: GameItemType;
  text: string;
};

export type GamePair = {
  id: string;
  principleId: string;
  definitionId: string;
  finalTitle: string;
  finalDescription: string;
};

export type GameContent = {
  gameVersion: string;
  totalPairs: 5;
  items: GameContentItem[];
  pairs: GamePair[];
};
