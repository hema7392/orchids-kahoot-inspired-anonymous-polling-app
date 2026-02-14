export interface Question {
  id: string;
  text: string;
  options: string[];
  timeLimit: number;
}

export interface GameState {
  screen: 'landing' | 'join' | 'host' | 'playing' | 'results' | 'waiting' | 'submitted';
  gameCode: string;
  participants: number;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, number[]>; // questionId -> array of option indices chosen by all players
  playerName: string;
  isHost: boolean;
  selectedOption: number | null;
  timeLeft: number;
}

export const defaultQuestions: Question[] = [
  {
    id: '1',
    text: 'What is the largest planet in our solar system?',
    options: ['Mars', 'Jupiter', 'Saturn', 'Neptune'],
    timeLimit: 20,
  },
  {
    id: '2',
    text: 'Which programming language was created first?',
    options: ['Python', 'JavaScript', 'C', 'Java'],
    timeLimit: 20,
  },
  {
    id: '3',
    text: 'What does "HTTP" stand for?',
    options: ['HyperText Transfer Protocol', 'High Tech Transfer Program', 'Home Tool Transfer Protocol', 'HyperText Timing Process'],
    timeLimit: 25,
  },
  {
    id: '4',
    text: 'Which country has the most time zones?',
    options: ['Russia', 'USA', 'France', 'China'],
    timeLimit: 20,
  },
  {
    id: '5',
    text: 'What year was the first iPhone released?',
    options: ['2005', '2006', '2007', '2008'],
    timeLimit: 15,
  },
];

export function generateGameCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function generateAnswers(questions: Question[], participants: number): Record<string, number[]> {
  const answers: Record<string, number[]> = {};
  questions.forEach(q => {
    const opts: number[] = [];
    for (let i = 0; i < participants; i++) {
      opts.push(Math.floor(Math.random() * q.options.length));
    }
    answers[q.id] = opts;
  });
  return answers;
}
