import { useState } from 'react';
import { useGame } from '../store/GameContext';
import type { Player } from '../types/game';
import './VotingScreen.css';

export default function VotingScreen() {
  const { state, dispatch } = useGame();
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const voter: Player = state.players[currentVoterIndex];
  const candidates = state.players.filter((p) => p.id !== voter.id);
  const isLastVoter = currentVoterIndex === state.players.length - 1;

  const handleVoteConfirm = () => {
    if (!selectedSuspect) return;
    dispatch({
      type: 'CAST_VOTE',
      vote: { voterId: voter.id, suspectId: selectedSuspect },
    });

    if (isLastVoter) {
      dispatch({ type: 'SET_PHASE', phase: 'reveal' });
    } else {
      setCurrentVoterIndex((i) => i + 1);
      setSelectedSuspect(null);
      setRevealed(false);
    }
  };

  const handleReveal = () => setRevealed(true);

  return (
    <div className="voting-screen">
      <div className="voting-header">
        <h2>🗳️ Voting Time!</h2>
        <p>Who is the imposter?</p>
        <div className="voter-progress">
          {state.players.map((_, i) => (
            <div
              key={i}
              className={`vprogress-dot ${i < currentVoterIndex ? 'done' : i === currentVoterIndex ? 'active' : ''
                }`}
            />
          ))}
        </div>
      </div>

      {/* Pass device prompt */}
      {!revealed ? (
        <div
          className="pass-device-card"
          onClick={handleReveal}
        >
          <div className="pass-avatar" style={{ background: voter.avatarColor }}>
            {voter.avatarIcon}
          </div>
          <h3>Pass to <strong>{voter.name}</strong></h3>
          <p>Only you should see this screen</p>
          <div className="tap-hint">👆 Tap to vote</div>
        </div>
      ) : (
        <div className="vote-cast-section">
          <div className="voter-chip">
            <div className="mini-avatar" style={{ background: voter.avatarColor }}>
              {voter.avatarIcon}
            </div>
            <span>{voter.name}</span>, pick your suspect:
          </div>

          <div className="candidates-grid">
            {candidates.map((candidate) => (
              <button
                key={candidate.id}
                className={`candidate-card ${selectedSuspect === candidate.id ? 'selected' : ''
                  }`}
                onClick={() => setSelectedSuspect(candidate.id)}
              >
                <div
                  className="candidate-avatar"
                  style={{ background: candidate.avatarColor }}
                >
                  {candidate.avatarIcon}
                </div>
                <span className="candidate-name">{candidate.name}</span>
                {selectedSuspect === candidate.id && (
                  <span className="vote-checkmark">✓</span>
                )}
              </button>
            ))}
          </div>

          <button
            className="confirm-vote-btn"
            onClick={handleVoteConfirm}
            disabled={!selectedSuspect}
          >
            {isLastVoter ? '🕵️ Reveal Imposter!' : 'Confirm Vote →'}
          </button>
        </div>
      )}
    </div>
  );
}
