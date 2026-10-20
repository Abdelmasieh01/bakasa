import React from 'react';
import { useGame } from '../store/GameContext';
import type { Player } from '../types/game';
import './Scoreboard.css';

export default function Scoreboard() {
  const { state, dispatch } = useGame();

  const sorted = [...state.players].sort((a, b) => b.score - a.score);
  const topScore = sorted[0]?.score ?? 0;

  const handleNextRound = () => dispatch({ type: 'NEXT_ROUND' });
  const handleRestart = () => dispatch({ type: 'RESET_GAME' });
  const handleSetup = () => dispatch({ type: 'SET_PHASE', phase: 'setup' });

  return (
    <div className="scoreboard-screen">
      <div className="scoreboard-header">
        <h2>🏆 Scoreboard</h2>
        <p>Round {state.roundNumber} complete!</p>
      </div>

      <div className="scores-list">
        {sorted.map((player, rank) => {
          const isImposter = state.imposterIds.includes(player.id);
          const isTop = player.score === topScore && topScore > 0;
          return (
            <div
              key={player.id}
              className={`score-row ${rank === 0 ? 'first' : rank === 1 ? 'second' : rank === 2 ? 'third' : ''}`}
            >
              <div className="rank-number">
                {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `#${rank + 1}`}
              </div>
              <div className="score-avatar" style={{ background: player.avatarColor }}>
                {player.avatarIcon}
              </div>
              <div className="score-info">
                <span className="score-name">
                  {player.name}
                  {isImposter && <span className="spy-inline">🕵️</span>}
                </span>
              </div>
              <div className="score-bar-wrap">
                <div
                  className="score-bar-fill"
                  style={{ width: topScore > 0 ? `${(player.score / topScore) * 100}%` : '0%' }}
                />
              </div>
              <div className="score-points">{player.score} pts</div>
            </div>
          );
        })}
      </div>

      {/* Scoring recap */}
      <div className="scoring-legend">
        <h3>How Points Were Earned</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span>🕵️ Guess item correctly</span>
            <strong>+100</strong>
          </div>
          <div className="legend-item">
            <span>🎭 Caught the imposter</span>
            <strong>+100</strong>
          </div>
          <div className="legend-item">
            <span>😈 Imposter not caught</span>
            <strong>+100 bonus</strong>
          </div>
        </div>
      </div>

      <div className="scoreboard-actions">
        <button className="next-round-btn" onClick={handleNextRound}>
          🎮 Next Round
        </button>
        <button className="restart-btn" onClick={handleSetup}>
          ✏️ Edit Players
        </button>
        <button className="reset-scores-btn" onClick={handleRestart}>
          🔄 Reset All Scores
        </button>
      </div>
    </div>
  );
}
