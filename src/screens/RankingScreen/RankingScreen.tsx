import { useEffect } from "react";
import { BrandScreen } from "../../components/layout/BrandScreen";
import { BrandButton } from "../../components/ui/BrandButton";
import { BrandCard } from "../../components/ui/BrandCard";
import { BrandTitle } from "../../components/ui/BrandTitle";
import type { RankingEntry } from "../../core/ranking/ranking.types";
import { useAuth } from "../../hooks/useAuth";
import { useRanking } from "../../hooks/useRanking";
import { formatDate } from "../../lib/formatDate";
import { formatDuration } from "../../lib/formatDuration";

type RankingScreenProps = {
  onPlayAgain: () => void;
  onGoHome: () => void;
};

export function RankingScreen({ onPlayAgain, onGoHome }: RankingScreenProps) {
  const { user } = useAuth();
  const { entries, bestUserEntry, isLoading, error, refresh } = useRanking();
  const userIsInTopTen = Boolean(user && entries.some((entry) => entry.uid === user.uid));

  useEffect(() => {
    refresh(user?.uid);
  }, [refresh, user?.uid]);

  return (
    <BrandScreen className="ranking-screen">
      <div className="ranking-shell">
        <BrandTitle title="Ranking Supernova" subtitle="Los mejores tiempos" />

        <BrandCard className="ranking-card">
          <div className="screen-stack">
            {isLoading ? <RankingStateMessage tone="muted">Cargando ranking...</RankingStateMessage> : null}
            {error ? <RankingStateMessage tone="error">{error}</RankingStateMessage> : null}
            {!isLoading && !error && entries.length === 0 ? (
              <RankingStateMessage tone="muted">Todavía no hay resultados. Jugá una partida y estrená el ranking.</RankingStateMessage>
            ) : null}

            {!isLoading && !error && entries.length > 0 ? (
              <ol className="ranking-list" aria-label="Top 10 global">
                {entries.map((entry, index) => (
                  <RankingRow
                    entry={entry}
                    isCurrentUser={Boolean(user && entry.uid === user.uid)}
                    key={`${entry.uid}-${entry.durationMs}-${entry.createdAt ?? index}`}
                    position={entry.rank ?? index + 1}
                  />
                ))}
              </ol>
            ) : null}

            {!isLoading && !error && bestUserEntry && !userIsInTopTen ? (
              <section className="ranking-best-user" aria-label="Tu mejor resultado">
                <span className="game-meta-label">Tu mejor tiempo</span>
                <RankingRow entry={bestUserEntry} isCurrentUser position={bestUserEntry.rank ?? 0} />
              </section>
            ) : null}

            <div className="ranking-actions">
              <BrandButton data-testid="ranking-play-again-button" onClick={onPlayAgain}>
                Jugar de nuevo
              </BrandButton>
              <BrandButton data-testid="ranking-home-button" onClick={onGoHome} variant="secondary">
                Volver al inicio
              </BrandButton>
            </div>
          </div>
        </BrandCard>
      </div>
    </BrandScreen>
  );
}

type RankingRowProps = {
  entry: RankingEntry;
  position: number;
  isCurrentUser: boolean;
};

function RankingRow({ entry, position, isCurrentUser }: RankingRowProps) {
  const playerName = entry.displayName ?? entry.email ?? "Jugador";

  return (
    <li className={`ranking-row ${isCurrentUser ? "ranking-row--current" : ""}`.trim()}>
      <span className="ranking-row__position">{position > 0 ? `#${position}` : "★"}</span>
      <span className="ranking-row__player">
        <strong>{playerName}</strong>
        <small>{formatDate(entry.createdAt)}</small>
      </span>
      <span className="ranking-row__time">{formatDuration(entry.durationMs)}</span>
    </li>
  );
}

type RankingStateMessageProps = {
  children: string;
  tone: "muted" | "error";
};

function RankingStateMessage({ children, tone }: RankingStateMessageProps) {
  return (
    <p className={`ranking-state ranking-state--${tone}`}>
      {children}
    </p>
  );
}
