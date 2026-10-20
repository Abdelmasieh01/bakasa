import { useState } from 'react';
import { useGame } from '../store/GameContext';
import type { Player } from '../types/game';
import TopicItemMedia from './TopicItemMedia';
import './RoleReveal.css';

export default function RoleReveal() {
  const { state, dispatch } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const player: Player = state.players[currentIndex];
  const isImposter = state.imposterIds.includes(player.id);
  const isLastPlayer = currentIndex === state.players.length - 1;

  const handleReveal = () => setRevealed(true);

  const handleNext = () => {
    setRevealed(false);
    if (isLastPlayer) {
      dispatch({ type: 'SET_PHASE', phase: 'round1' });
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <div className="role-reveal-screen">
      <div className="role-progress">
        {state.players.map((_, i) => (
          <div
            key={i}
            className={`progress-dot ${i < currentIndex ? 'done' : i === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>

      <h2 className="role-title">
        Pass the phone to <strong>{player.name}</strong>
      </h2>
      <p className="role-subtitle">Only you should see this screen</p>

      <div
        className={`role-card ${revealed ? (isImposter ? 'imposter' : 'normal') : 'hidden'}`}
        onClick={!revealed ? handleReveal : undefined}
      >
        {!revealed ? (
          <div className="role-tap-prompt">
            <div className="tap-icon">👆</div>
            <p>Tap to reveal your role</p>
          </div>
        ) : (
          <div className="role-content">
            <div
              className="role-avatar"
              style={{ background: player.avatarColor }}
            >
              {player.avatarIcon}
            </div>
            <div className="role-badge">
              {isImposter ? '🕵️ IMPOSTER' : '✅ PLAYER'}
            </div>
            {isImposter ? (
              <div className="role-info">
                <p className="role-text">You are the <strong>Imposter!</strong></p>
                <p className="role-hint">
                  You don't know the secret item. Blend in — ask convincing questions.
                  If nobody catches you, you win big!
                </p>
              </div>
            ) : (
              <div className="role-info">
                <p className="role-text">
                  The secret item is:
                </p>
                <div className="item-reveal">
                  <TopicItemMedia item={state.currentItem} size="lg" className="item-reveal-media" />
                  <span className="item-name">{state.currentItem?.name}</span>
                  {state.currentItem?.hint && (
                    <span className="item-hint">"{state.currentItem.hint}"</span>
                  )}
                </div>
                <p className="role-hint">
                  Find the imposter — they won't know this item!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {revealed && (
        <button className="next-player-btn" onClick={handleNext}>
          {isLastPlayer ? '🎮 Start Game!' : `Next: ${state.players[currentIndex + 1]?.name} →`}
        </button>
      )}
    </div>
  );
}
