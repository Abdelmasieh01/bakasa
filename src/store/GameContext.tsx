import { createContext, useContext, useReducer, useEffect, type ReactNode, type Dispatch } from 'react';
import type { GameState } from '../types/game';
import type { GameAction } from './gameReducer';
import { gameReducer, initialState } from './gameReducer';

const LS_KEY = 'bakasa_game_state';

interface GameContextValue {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState, () => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed: GameState = JSON.parse(saved);
        // Always start fresh at setup if no players saved
        if (!parsed.players || parsed.players.length === 0) return initialState;
        // Resume only if we have players; always return to setup for safety
        return { ...parsed, phase: 'setup' as const };
      }
    } catch {
      // ignore
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <GameContext.Provider value={{ state: state as GameState, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
