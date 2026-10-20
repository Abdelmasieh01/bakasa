import { useEffect, useState } from 'react';
import { useGame } from '../store/GameContext';
import './RevealScreen.css';

export default function RevealScreen() {
  const { state, dispatch } = useGame();
  const [animDone, setAnimDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimDone(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const imposters = state.players.filter((p) =>
    state.imposterIds.includes(p.id)
  );

  // Tally votes
  const voteMap: Record<string, number> = {};
  state.votes.forEach((v) => {
    voteMap[v.suspectId] = (voteMap[v.suspectId] || 0) + 1;
  });

  const imposterCaught = state.imposterIds.some((id) => (voteMap[id] || 0) > 0);

  return (
    <div className="reveal-screen">
      <div className={`reveal-animation ${animDone ? 'done' : ''}`}>
        <div className="reveal-drama">
          <span className="drama-emoji">🎭</span>
        </div>
      </div>

      {animDone && (
        <div className="reveal-content">
          <h2 className="reveal-title">The Imposter{imposters.length > 1 ? 's' : ''} revealed!</h2>

          <div className="imposters-showcase">
            {imposters.map((imp) => (
              <div key={imp.id} className="imposter-reveal-card">
                <div
                  className="reveal-avatar"
                  style={{ background: imp.avatarColor }}
                >
                  {imp.avatarIcon}
                </div>
                <span className="reveal-name">{imp.name}</span>
                <div className="spy-badge">🕵️ IMPOSTER</div>
                <div className="votes-count">
                  Got {voteMap[imp.id] || 0} vote{(voteMap[imp.id] || 0) !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>

          {imposterCaught ? (
            <div className="caught-banner caught">
              😅 The imposter was caught by the crowd!
            </div>
          ) : (
            <div className="caught-banner escaped">
              🎉 The imposter escaped detection! +100 bonus!
            </div>
          )}

          {/* Vote breakdown */}
          <div className="vote-breakdown">
            <h3>Vote Breakdown</h3>
            {state.players
              .sort((a, b) => (voteMap[b.id] || 0) - (voteMap[a.id] || 0))
              .map((p) => (
                <div key={p.id} className="vote-row">
                  <div className="vote-mini-avatar" style={{ background: p.avatarColor }}>
                    {p.avatarIcon}
                  </div>
                  <span className="vote-player-name">{p.name}</span>
                  {state.imposterIds.includes(p.id) && (
                    <span className="spy-tag">🕵️</span>
                  )}
                  <div className="vote-bar-container">
                    <div
                      className="vote-bar"
                      style={{ width: `${((voteMap[p.id] || 0) / state.players.length) * 100}%` }}
                    />
                  </div>
                  <span className="vote-num">{voteMap[p.id] || 0}</span>
                </div>
              ))}
          </div>

          <button
            className="next-reveal-btn"
            onClick={() => dispatch({ type: 'SET_PHASE', phase: 'imposter-guess' })}
          >
            {imposters.length > 1 ? 'Imposters' : 'Imposter'}: Guess the Item →
          </button>
        </div>
      )}
    </div>
  );
}
