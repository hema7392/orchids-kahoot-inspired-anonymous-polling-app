"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { GameState, Question, defaultQuestions, generateGameCode, generateAnswers } from './game-store';

interface GameContextType {
  state: GameState;
  goToScreen: (screen: GameState['screen']) => void;
  hostGame: () => void;
  joinGame: (code: string, name: string) => void;
  startGame: () => void;
  nextQuestion: () => void;
  selectOption: (index: number) => void;
  submitAnswer: () => void;
  showResults: () => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (id: string, question: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  resetGame: () => void;
  setTimeLeft: (t: number) => void;
}

const initialState: GameState = {
  screen: 'landing',
  gameCode: '',
  participants: 0,
  questions: defaultQuestions,
  currentQuestionIndex: 0,
  answers: {},
  playerName: '',
  isHost: false,
  selectedOption: null,
  timeLeft: 0,
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);

  const goToScreen = useCallback((screen: GameState['screen']) => {
    setState(prev => ({ ...prev, screen }));
  }, []);

  const hostGame = useCallback(() => {
    const code = generateGameCode();
    const participants = Math.floor(Math.random() * 15) + 8;
    setState(prev => ({
      ...prev,
      screen: 'host',
      gameCode: code,
      participants,
      isHost: true,
      currentQuestionIndex: 0,
      answers: {},
      selectedOption: null,
    }));
  }, []);

  const joinGame = useCallback((code: string, name: string) => {
    setState(prev => ({
      ...prev,
      screen: 'playing',
      gameCode: code || generateGameCode(),
      playerName: name || 'Anonymous',
      isHost: false,
      currentQuestionIndex: 0,
      selectedOption: null,
      timeLeft: prev.questions[0]?.timeLimit || 20,
    }));
  }, []);

  const startGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      screen: 'playing',
      currentQuestionIndex: 0,
      selectedOption: null,
      timeLeft: prev.questions[0]?.timeLimit || 20,
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    setState(prev => {
      const nextIdx = prev.currentQuestionIndex + 1;
      if (nextIdx >= prev.questions.length) {
        return { ...prev, screen: 'results', currentQuestionIndex: 0 };
      }
      return {
        ...prev,
        screen: prev.isHost ? 'playing' : 'playing',
        currentQuestionIndex: nextIdx,
        selectedOption: null,
        timeLeft: prev.questions[nextIdx]?.timeLimit || 20,
      };
    });
  }, []);

  const selectOption = useCallback((index: number) => {
    setState(prev => ({ ...prev, selectedOption: index }));
  }, []);

  const submitAnswer = useCallback(() => {
    setState(prev => {
      if (prev.selectedOption === null) return prev;
      const q = prev.questions[prev.currentQuestionIndex];
      const existing = prev.answers[q.id] || [];
      return {
        ...prev,
        screen: 'submitted',
        answers: {
          ...prev.answers,
          [q.id]: [...existing, prev.selectedOption],
        },
      };
    });
  }, []);

  const showResults = useCallback(() => {
    setState(prev => {
      const answers = generateAnswers(prev.questions, prev.participants);
      return { ...prev, screen: 'results', answers };
    });
  }, []);

  const addQuestion = useCallback((question: Question) => {
    setState(prev => ({
      ...prev,
      questions: [...prev.questions, question],
    }));
  }, []);

  const updateQuestion = useCallback((id: string, updates: Partial<Question>) => {
    setState(prev => ({
      ...prev,
      questions: prev.questions.map(q => q.id === id ? { ...q, ...updates } : q),
    }));
  }, []);

  const deleteQuestion = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id),
    }));
  }, []);

  const resetGame = useCallback(() => {
    setState({ ...initialState, questions: defaultQuestions });
  }, []);

  const setTimeLeft = useCallback((t: number) => {
    setState(prev => ({ ...prev, timeLeft: t }));
  }, []);

  return (
    <GameContext.Provider value={{
      state, goToScreen, hostGame, joinGame, startGame, nextQuestion,
      selectOption, submitAnswer, showResults, addQuestion, updateQuestion,
      deleteQuestion, resetGame, setTimeLeft,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
}
