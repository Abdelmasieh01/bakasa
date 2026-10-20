import { GameProvider, useGame } from './store/GameContext';
import SetupScreen from './components/SetupScreen';
import TopicSelect from './components/TopicSelect';
import RoleReveal from './components/RoleReveal';
import QuestionRound from './components/QuestionRound';
import VotingScreen from './components/VotingScreen';
import RevealScreen from './components/RevealScreen';
import ImposterGuess from './components/ImposterGuess';
import Scoreboard from './components/Scoreboard';
import './App.css';

function GameRouter() {
  const { state } = useGame();

  switch (state.phase) {
    case 'setup': return <SetupScreen />;
    case 'topic-select': return <TopicSelect />;
    case 'role-reveal': return <RoleReveal />;
    case 'round1': return <QuestionRound round={1} />;
    case 'round2': return <QuestionRound round={2} />;
    case 'voting': return <VotingScreen />;
    case 'reveal': return <RevealScreen />;
    case 'imposter-guess': return <ImposterGuess />;
    case 'scoreboard': return <Scoreboard />;
    default: return <SetupScreen />;
  }
}

export default function App() {
  return (
    <GameProvider>
      <div className="app-shell">
        <GameRouter />
      </div>
    </GameProvider>
  );
}
