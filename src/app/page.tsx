"use client";

import { useGame } from '@/lib/game-context';
import LandingPage from '@/components/LandingPage';
import JoinGameScreen from '@/components/JoinGameScreen';
import HostDashboard from '@/components/HostDashboard';
import QuestionScreen from '@/components/QuestionScreen';
import ResultsScreen from '@/components/ResultsScreen';

export default function Home() {
  const { state } = useGame();

  switch (state.screen) {
    case 'landing':
      return <LandingPage />;
    case 'join':
      return <JoinGameScreen />;
    case 'host':
      return <HostDashboard />;
    case 'playing':
    case 'submitted':
      return <QuestionScreen />;
    case 'results':
      return <ResultsScreen />;
    default:
      return <LandingPage />;
  }
}
