import { useGame } from '../store/GameContext';
import type { Player } from '../types/game';
import './QuestionRound.css';

interface QuestionRoundProps {
  round: 1 | 2;
}

export default function QuestionRound({ round }: QuestionRoundProps) {
  const { state, dispatch } = useGame();

  const pairs = round === 1 ? state.round1Pairs : state.round2Pairs;
  const totalPairs = pairs.length;

  // Clamp index so we don't go out of bounds
  const pairIndex = Math.min(state.currentPairIndex, totalPairs - 1);
  const pair = pairs[pairIndex];

  const getPlayer = (id: string): Player =>
    state.players.find((p) => p.id === id)!;

  const asker = pair ? getPlayer(pair.askerId) : null;
  const answerer = pair ? getPlayer(pair.answerId) : null;

  const handleNext = () => {
    dispatch({ type: 'NEXT_PAIR' });
  };

  const handleStartVote = () => {
    dispatch({ type: 'SET_PHASE', phase: 'voting' });
  };

  if (!pair || !asker) {
    return null;
  }

  return (
    <div className="question-screen">
      {/* Round indicator */}
      <div className="round-header">
        <span className="round-label">
          {round === 1 ? 'Round 1 — Q&A' : 'Round 2 — Free Questions'}
        </span>
        {round === 1 ? (
          <>
            <div className="pair-progress">
              {pairs.map((_, i) => (
                <div
                  key={i}
                  className={`pair-dot ${
                    i < pairIndex ? 'done' : i === pairIndex ? 'active' : ''
                  }`}
                />
              ))}
            </div>
            <span className="pair-count">
              {pairIndex + 1} / {totalPairs}
            </span>
          </>
        ) : (
          <div className="free-round-badge">
            <span className="badge-pulse">●</span> Infinite Round
          </div>
        )}
      </div>

      {/* Question card */}
      <div className="question-card">
        {/* Asker / Questioner — always shown */}
        <div className="player-role-badge">
          <div className="role-chip asker-chip">
            {round === 1 ? 'ASKING' : 'QUESTIONER / السائل'}
          </div>
          <div className="player-avatar-lg" style={{ background: asker.avatarColor }}>
            {asker.avatarIcon}
          </div>
          <span className="player-name-label">{asker.name}</span>
        </div>

        {/* Answerer — ONLY shown in round 1 (in round 2, anyone can be chosen to answer) */}
        {round === 1 && answerer && (
          <>
            <div className="arrow-divider">
              <div className="arrow-line" />
              <span className="arrow-icon">❓</span>
              <div className="arrow-line" />
            </div>

            <div className="player-role-badge">
              <div className="role-chip answerer-chip">ANSWERING</div>
              <div className="player-avatar-lg" style={{ background: answerer.avatarColor }}>
                {answerer.avatarIcon}
              </div>
              <span className="player-name-label">{answerer.name}</span>
            </div>
          </>
        )}

        {/* Round 2: free-form guidance */}
        {round === 2 && (
          <div className="free-round-box">
            <span className="free-round-icon">🎙️</span>
            <p><strong>{asker.name}</strong>, choose anyone in the group to question!</p>
            <small>Anyone can answer — repeat turns until someone calls a vote.</small>
          </div>
        )}
      </div>

      {/* Topic reminder */}
      <div className="topic-reminder">
        <span className="topic-emoji-sm">{state.topic?.emoji}</span>
        <span>Topic: <strong>{state.topic?.name}</strong></span>
      </div>

      <p className="question-instruction">
        {round === 1
          ? <><strong>{asker.name}</strong>, ask <strong>{answerer?.name}</strong> a question about the topic.</>
          : <><strong>{asker.name}</strong> can question anyone! Ask freely, then continue or vote.</>
        }
      </p>

      <div className="action-row">
        <button className="answered-btn" onClick={handleNext}>
          {round === 1 ? 'Next →' : 'Next Questioner →'}
        </button>

        {round === 2 && (
          <button className="start-vote-btn" onClick={handleStartVote}>
            🗳️ Start Voting
          </button>
        )}
      </div>
    </div>
  );
}
