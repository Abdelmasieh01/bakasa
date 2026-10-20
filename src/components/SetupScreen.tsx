import { useState, useEffect } from 'react';
import { useGame } from '../store/GameContext';
import type { Player } from '../types/game';
import { createPlayer } from '../utils/avatars';
import AvatarPicker from './AvatarPicker';
import './SetupScreen.css';

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 12;
const LS_PLAYERS_KEY = 'bakasa_players';

export default function SetupScreen() {
  const { dispatch } = useGame();
  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem(LS_PLAYERS_KEY);
      if (saved) {
        const parsed: Player[] = JSON.parse(saved);
        if (parsed.length >= MIN_PLAYERS) return parsed.map(p => ({ ...p, score: 0, isImposter: false }));
      }
    } catch { /* */ }
    return [createPlayer(0), createPlayer(1), createPlayer(2)];
  });

  const [editingAvatar, setEditingAvatar] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem(LS_PLAYERS_KEY, JSON.stringify(players));
  }, [players]);

  const addPlayer = () => {
    if (players.length >= MAX_PLAYERS) return;
    setPlayers((prev) => [...prev, createPlayer(prev.length)]);
  };

  const removePlayer = (id: string) => {
    if (players.length <= MIN_PLAYERS) return;
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const updateName = (id: string, name: string) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const updateAvatar = (id: string, icon: string, color: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, avatarIcon: icon, avatarColor: color } : p))
    );
  };

  const handleStart = () => {
    const unnamed = players.filter((p) => !p.name.trim());
    if (unnamed.length > 0) {
      setError('All players must have a name!');
      return;
    }
    const names = players.map((p) => p.name.trim().toLowerCase());
    const unique = new Set(names);
    if (unique.size !== names.length) {
      setError('Player names must be unique!');
      return;
    }
    setError('');
    dispatch({ type: 'SET_PLAYERS', players: players.map(p => ({ ...p, score: 0 })) });
    dispatch({ type: 'SET_HOST', hostId: players[0].id });
    dispatch({ type: 'SET_PHASE', phase: 'topic-select' });
  };

  const editingPlayer = players.find((p) => p.id === editingAvatar);

  return (
    <div className="setup-screen">
      {/* Header */}
      <div className="setup-header">
        <div className="logo-badge">🎭</div>
        <h1 className="game-title">BAKASA</h1>
        <p className="game-subtitle">The Imposter Among Us</p>
      </div>

      {/* Player list */}
      <div className="players-container">
        <div className="players-header">
          <h2>Players <span className="count-badge">{players.length}</span></h2>
          <p className="players-hint">Add {MIN_PLAYERS}–{MAX_PLAYERS} players to start</p>
        </div>

        <div className="player-list">
          {players.map((player, index) => (
            <div className="player-card" key={player.id}>
              <span className="player-index">{index + 1}</span>

              <button
                className="avatar-btn"
                style={{ background: player.avatarColor }}
                onClick={() => setEditingAvatar(player.id)}
                title="Change avatar"
              >
                <span className="avatar-icon">{player.avatarIcon}</span>
              </button>

              <input
                className="player-name-input"
                type="text"
                placeholder={`Player ${index + 1}`}
                value={player.name}
                maxLength={20}
                onChange={(e) => updateName(player.id, e.target.value)}
              />

              <button
                className="remove-btn"
                onClick={() => removePlayer(player.id)}
                disabled={players.length <= MIN_PLAYERS}
                title="Remove player"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {players.length < MAX_PLAYERS && (
          <button className="add-player-btn" onClick={addPlayer}>
            <span>+</span> Add Player
          </button>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}

      <button className="start-btn" onClick={handleStart}>
        Start Game →
      </button>

      {/* Avatar picker modal */}
      {editingAvatar && editingPlayer && (
        <AvatarPicker
          currentIcon={editingPlayer.avatarIcon}
          currentColor={editingPlayer.avatarColor}
          onSave={(icon, color) => {
            updateAvatar(editingAvatar, icon, color);
            setEditingAvatar(null);
          }}
          onClose={() => setEditingAvatar(null)}
        />
      )}
    </div>
  );
}
