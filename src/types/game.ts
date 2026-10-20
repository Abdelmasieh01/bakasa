// ─── Player ───────────────────────────────────────────────────────────────────
export interface Player {
  id: string;
  name: string;
  avatarIcon: string; // emoji or icon key
  avatarColor: string; // hex color
  score: number;
  isImposter: boolean;
}

// ─── Topic / Item ─────────────────────────────────────────────────────────────
export interface TopicItem {
  id: string;
  name: string;
  image?: string; // optional image path or URL or emoji
  emoji?: string; // optional emoji
  hint?: string;  // optional hint text
}

export interface Topic {
  id: string;
  name: string;
  emoji: string;
  items: TopicItem[];
}

// ─── Q&A Pair ─────────────────────────────────────────────────────────────────
export interface QAPair {
  askerId: string;
  answerId: string;
  round: 1 | 2;
}

// ─── Vote ─────────────────────────────────────────────────────────────────────
export interface Vote {
  voterId: string;
  suspectId: string;
}

// ─── Game Phase ───────────────────────────────────────────────────────────────
export type GamePhase =
  | 'setup'          // setting player names + avatars
  | 'topic-select'   // host picks topic
  | 'role-reveal'    // each player sees their role (private)
  | 'round1'         // randomized Q&A
  | 'round2'         // free Q&A / vote
  | 'voting'         // cast votes
  | 'reveal'         // reveal imposter
  | 'imposter-guess' // imposter guesses the item
  | 'scoreboard';    // final scores

// ─── Game State ───────────────────────────────────────────────────────────────
export interface GameState {
  phase: GamePhase;
  players: Player[];
  hostId: string | null;
  topic: Topic | null;
  currentItem: TopicItem | null;
  imposterIds: string[];        // supports imposter teams
  round1Pairs: QAPair[];        // pre-generated pairs for round 1
  round2Pairs: QAPair[];        // pre-generated pairs for round 2
  currentPairIndex: number;
  currentRound: 1 | 2;
  votes: Vote[];
  imposterGuess: string | null; // the item name the imposter guessed
  roundNumber: number;          // persistent round counter across replays
}
