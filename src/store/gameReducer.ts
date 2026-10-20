import type { GameState, Player, Topic, TopicItem, Vote } from '../types/game';
import { shuffleArray, generateQAPairs } from '../utils/helpers';

export type GameAction =
  | { type: 'SET_PLAYERS'; players: Player[] }
  | { type: 'SET_HOST'; hostId: string }
  | { type: 'SELECT_TOPIC'; topic: Topic; item: TopicItem; imposterIds: string[] }
  | { type: 'SET_PHASE'; phase: GameState['phase'] }
  | { type: 'NEXT_PAIR' }
  | { type: 'CAST_VOTE'; vote: Vote }
  | { type: 'SET_IMPOSTER_GUESS'; guess: string }
  | { type: 'APPLY_SCORES' }
  | { type: 'NEXT_ROUND' }
  | { type: 'RESET_GAME' };

export const initialState: GameState = {
  phase: 'setup',
  players: [],
  hostId: null,
  topic: null,
  currentItem: null,
  imposterIds: [],
  round1Pairs: [],
  round2Pairs: [],
  currentPairIndex: 0,
  currentRound: 1,
  votes: [],
  imposterGuess: null,
  roundNumber: 1,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYERS':
      return { ...state, players: action.players };

    case 'SET_HOST':
      return { ...state, hostId: action.hostId };

    case 'SELECT_TOPIC': {
      const playerIds = state.players.map((p) => p.id);
      const r1 = generateQAPairs(playerIds, 1);
      const r2 = generateQAPairs(playerIds, 2);
      const updatedPlayers = state.players.map((p) => ({
        ...p,
        isImposter: action.imposterIds.includes(p.id),
      }));
      return {
        ...state,
        topic: action.topic,
        currentItem: action.item,
        imposterIds: action.imposterIds,
        players: updatedPlayers,
        round1Pairs: r1,
        round2Pairs: r2,
        currentPairIndex: 0,
        currentRound: 1,
        votes: [],
        imposterGuess: null,
      };
    }

    case 'SET_PHASE':
      return { ...state, phase: action.phase };

    case 'NEXT_PAIR': {
      const pairs =
        state.currentRound === 1 ? state.round1Pairs : state.round2Pairs;
      const nextIndex = state.currentPairIndex + 1;
      if (nextIndex >= pairs.length) {
        if (state.currentRound === 1) {
          // Transition from round 1 → round 2
          return {
            ...state,
            currentRound: 2,
            currentPairIndex: 0,
            phase: 'round2',
          };
        } else {
          // Round 2 is infinite — reshuffle and loop from the start
          const newR2 = generateQAPairs(state.players.map((p) => p.id), 2);
          return { ...state, round2Pairs: newR2, currentPairIndex: 0 };
        }
      }
      return { ...state, currentPairIndex: nextIndex };
    }

    case 'CAST_VOTE': {
      const existing = state.votes.findIndex(
        (v) => v.voterId === action.vote.voterId
      );
      const votes =
        existing >= 0
          ? state.votes.map((v, i) => (i === existing ? action.vote : v))
          : [...state.votes, action.vote];
      return { ...state, votes };
    }

    case 'SET_IMPOSTER_GUESS':
      return { ...state, imposterGuess: action.guess };

    case 'APPLY_SCORES': {
      const { votes, imposterIds, currentItem, imposterGuess, players } = state;

      const voteCountMap: Record<string, number> = {};
      votes.forEach((v) => {
        voteCountMap[v.suspectId] = (voteCountMap[v.suspectId] || 0) + 1;
      });

      // Correct imposter guess
      const imposterGuessCorrect =
        imposterGuess?.toLowerCase().trim() ===
        currentItem?.name.toLowerCase().trim();

      // Was imposter caught by anyone?
      const imposterCaught = imposterIds.some((id) => (voteCountMap[id] || 0) > 0);

      const updatedPlayers = players.map((p) => {
        let delta = 0;

        if (!imposterIds.includes(p.id)) {
          // Regular player: +100 if they voted correctly for an imposter
          const myVote = votes.find((v) => v.voterId === p.id);
          if (myVote && imposterIds.includes(myVote.suspectId)) {
            delta += 100;
          }
        } else {
          // Imposter scoring
          if (imposterGuessCorrect) delta += 100;
          if (!imposterCaught) delta += 100;
        }

        return { ...p, score: p.score + delta };
      });

      return { ...state, players: updatedPlayers };
    }

    case 'NEXT_ROUND': {
      const playerIds = state.players.map((p) => p.id);
      const r1 = generateQAPairs(playerIds, 1);
      const r2 = generateQAPairs(playerIds, 2);
      return {
        ...state,
        phase: 'topic-select',
        topic: null,
        currentItem: null,
        imposterIds: [],
        round1Pairs: r1,
        round2Pairs: r2,
        currentPairIndex: 0,
        currentRound: 1,
        votes: [],
        imposterGuess: null,
        roundNumber: state.roundNumber + 1,
        players: state.players.map((p) => ({ ...p, isImposter: false })),
      };
    }

    case 'RESET_GAME':
      return {
        ...initialState,
        players: state.players.map((p) => ({ ...p, score: 0, isImposter: false })),
        roundNumber: 1,
      };

    default:
      return state;
  }
}

// Shuffle helper also exported for external use
export { shuffleArray };
