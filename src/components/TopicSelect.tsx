import { useState, useEffect } from 'react';
import { useGame } from '../store/GameContext';
import { loadTopics } from '../utils/topicLoader';
import type { Topic, TopicItem } from '../types/game';
import { pickRandom } from '../utils/helpers';
import './TopicSelect.css';

export default function TopicSelect() {
  const { state, dispatch } = useGame();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selected, setSelected] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [imposterCount, setImposterCount] = useState(1);

  useEffect(() => {
    loadTopics().then((t) => {
      setTopics(t);
      setLoading(false);
    });
  }, []);

  const maxImposters = Math.floor(state.players.length / 2) - (state.players.length % 2 === 0 ? 1 : 0);

  const handleConfirm = () => {
    if (!selected) return;
    const item: TopicItem = pickRandom(selected.items);

    // Pick random imposter(s)
    const shuffledIds = [...state.players.map((p) => p.id)].sort(
      () => Math.random() - 0.5
    );
    const imposterIds = shuffledIds.slice(0, imposterCount);

    dispatch({ type: 'SELECT_TOPIC', topic: selected, item, imposterIds });
    dispatch({ type: 'SET_PHASE', phase: 'role-reveal' });
  };

  return (
    <div className="topic-screen">
      <div className="topic-header">
        <h2>Choose a Topic</h2>
        <p>Pick what everyone will be thinking about today</p>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading topics…</div>
      ) : (
        <div className="topic-grid">
          {topics.map((topic) => (
            <button
              key={topic.id}
              className={`topic-card ${selected?.id === topic.id ? 'selected' : ''}`}
              onClick={() => setSelected(topic)}
            >
              <span className="topic-emoji">{topic.emoji}</span>
              <span className="topic-name">{topic.name}</span>
              {selected?.id === topic.id && (
                <span className="topic-check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Imposter count */}
      <div className="imposter-config">
        <h3>Number of Imposters</h3>
        <div className="imposter-stepper">
          <button
            onClick={() => setImposterCount((n) => Math.max(1, n - 1))}
            disabled={imposterCount <= 1}
          >−</button>
          <span className="imposter-count">{imposterCount}</span>
          <button
            onClick={() => setImposterCount((n) => Math.min(maxImposters, n + 1))}
            disabled={imposterCount >= maxImposters}
          >+</button>
        </div>
        <p className="imposter-hint">
          Max {maxImposters} imposters for {state.players.length} players
        </p>
      </div>

      <button
        className="confirm-btn"
        onClick={handleConfirm}
        disabled={!selected}
      >
        Let's Play! 🎯
      </button>
    </div>
  );
}
