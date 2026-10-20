import { useState, useMemo } from 'react';
import { useGame } from '../store/GameContext';
import { shuffleArray } from '../utils/helpers';
import './ImposterGuess.css';

export default function ImposterGuess() {
  const { state, dispatch } = useGame();
  const [guess, setGuess] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);

  const imposters = state.players.filter((p) =>
    state.imposterIds.includes(p.id)
  );

  const options = useMemo(() => {
    if (!state.topic || !state.currentItem) return [];
    const correctItem = state.currentItem;
    const otherItems = state.topic.items.filter(
      (item) =>
        item.id !== correctItem.id &&
        item.name.toLowerCase() !== correctItem.name.toLowerCase()
    );
    const randomOthers = shuffleArray(otherItems).slice(0, 4);
    return shuffleArray([correctItem, ...randomOthers]);
  }, [state.topic, state.currentItem]);

  const handleSubmit = () => {
    const correct =
      guess.trim().toLowerCase() === state.currentItem?.name.toLowerCase();
    setCorrect(correct);
    setSubmitted(true);
    dispatch({ type: 'SET_IMPOSTER_GUESS', guess: guess.trim() });
  };

  const handleFinish = () => {
    dispatch({ type: 'APPLY_SCORES' });
    dispatch({ type: 'SET_PHASE', phase: 'scoreboard' });
  };

  return (
    <div className="imposter-guess-screen">
      <div className="guess-header">
        <h2>🕵️ Imposter's Last Chance!</h2>
        <p>Can you guess what the secret item was?</p>
      </div>

      <div className="imposters-row">
        {imposters.map((imp) => (
          <div key={imp.id} className="imp-mini-card">
            <div className="imp-avatar" style={{ background: imp.avatarColor }}>
              {imp.avatarIcon}
            </div>
            <span>{imp.name}</span>
          </div>
        ))}
      </div>

      <div className="topic-clue">
        <span className="topic-emoji-lg">{state.topic?.emoji}</span>
        <p>
          Topic: <strong>{state.topic?.name}</strong>
        </p>
        <p className="think-hint">Think carefully… what were people hinting at?</p>
      </div>

      {!submitted ? (
        <div className="guess-input-section">
          <div className="select-container">
            <select
              className="guess-select"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              autoFocus
            >
              <option value="" disabled>
                -- Choose secret item / اختر العنصر --
              </option>
              {options.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="submit-guess-btn"
            onClick={handleSubmit}
            disabled={!guess}
          >
            Submit Guess 🎯
          </button>
        </div>
      ) : (
        <div className={`guess-result ${correct ? 'correct' : 'wrong'}`}>
          {correct ? (
            <>
              <div className="result-emoji">🎉</div>
              <h3>Correct! The item was "{state.currentItem?.name}"</h3>
              <p>Imposter earns +100 points!</p>
            </>
          ) : (
            <>
              <div className="result-emoji">😬</div>
              <h3>Wrong! You guessed "{guess}"</h3>
              <p>
                The real item was: <strong>{state.currentItem?.name}</strong>
              </p>
            </>
          )}
          <button className="finish-btn" onClick={handleFinish}>
            See Scores 🏆
          </button>
        </div>
      )}
    </div>
  );
}
