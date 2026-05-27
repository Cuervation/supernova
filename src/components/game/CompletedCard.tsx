import type { GamePair } from "../../core/game/game-content.types";

type CompletedCardProps = {
  pair: GamePair;
  isLatest: boolean;
};

export function CompletedCard({ pair, isLatest }: CompletedCardProps) {
  return (
    <article className={`completed-card ${isLatest ? "completed-card--latest" : ""}`.trim()}>
      <h3>{pair.finalTitle}</h3>
      <p>{pair.finalDescription}</p>
    </article>
  );
}
