"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { Clock, Send, CheckCircle2, Zap, Triangle, Square, Circle, Star } from 'lucide-react';

const optionIcons = [Triangle, Square, Circle, Star];
const optionColorClasses = [
  'option-red hover:brightness-110',
  'option-blue hover:brightness-110',
  'option-yellow hover:brightness-110',
  'option-green hover:brightness-110',
];
const optionSelectedClasses = [
  'option-red ring-4 ring-white shadow-2xl scale-[1.02]',
  'option-blue ring-4 ring-white shadow-2xl scale-[1.02]',
  'option-yellow ring-4 ring-white shadow-2xl scale-[1.02]',
  'option-green ring-4 ring-white shadow-2xl scale-[1.02]',
];

export default function QuestionScreen() {
  const { state, selectOption, submitAnswer, nextQuestion, setTimeLeft } = useGame();
  const question = state.questions[state.currentQuestionIndex];
  const isSubmitted = state.screen === 'submitted';
  const [countdown, setCountdown] = useState<number | null>(3);

  // Countdown before question
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setCountdown(null);
      return;
    }
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Timer
  useEffect(() => {
    if (countdown !== null) return;
    if (isSubmitted) return;
    if (state.timeLeft <= 0) return;
    const t = setInterval(() => {
      setTimeLeft(state.timeLeft - 1);
    }, 1000);
    return () => clearInterval(t);
  }, [countdown, state.timeLeft, isSubmitted, setTimeLeft]);

  // Auto advance for submitted
  const handleNext = () => {
    nextQuestion();
    setCountdown(3);
  };

  if (!question) return null;

  // Countdown overlay
  if (countdown !== null && countdown > 0) {
    return (
      <div className="min-h-screen game-gradient flex items-center justify-center">
        <motion.div
          key={countdown}
          className="text-white text-9xl font-black text-shadow-game"
          initial={{ scale: 2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {countdown}
        </motion.div>
      </div>
    );
  }

  // Submitted state
  if (isSubmitted) {
    return (
      <div className="min-h-screen game-gradient flex flex-col items-center justify-center px-4">
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <motion.div
            className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mb-6 shadow-2xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-4xl font-black text-white text-shadow-game mb-2">Answer Submitted!</h2>
          <p className="text-white/60 text-lg mb-8">Your response is anonymous</p>

          <div className="glass-card rounded-2xl p-6 mb-6 max-w-sm w-full">
            <p className="text-white/60 text-sm mb-1">Question {state.currentQuestionIndex + 1} of {state.questions.length}</p>
            <div className="w-full bg-white/10 rounded-full h-2 mt-2">
              <motion.div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((state.currentQuestionIndex + 1) / state.questions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <motion.button
            onClick={handleNext}
            className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg py-4 px-10 shadow-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {state.currentQuestionIndex + 1 < state.questions.length ? 'Next Question' : 'See Results'}
          </motion.button>
        </motion.div>

        {/* Confetti */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-3 h-3 rounded-sm ${['bg-red-400', 'bg-blue-400', 'bg-yellow-400', 'bg-green-400', 'bg-pink-400', 'bg-purple-400'][i % 6]}`}
            style={{ left: `${Math.random() * 100}%` }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{ y: '100vh', opacity: 0, rotate: 720 }}
            transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5, ease: 'easeIn' }}
          />
        ))}
      </div>
    );
  }

  const timerPercentage = (state.timeLeft / question.timeLimit) * 100;
  const timerColor = state.timeLeft > 10 ? 'text-green-400' : state.timeLeft > 5 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="min-h-screen bg-[#1a0533] flex flex-col">
      {/* Top bar - Timer & Progress */}
      <div className="relative z-10 px-4 sm:px-6 py-3 flex items-center justify-between border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span className="text-white/60 text-sm font-medium">
            Q{state.currentQuestionIndex + 1}/{state.questions.length}
          </span>
        </div>

        <div className={`flex items-center gap-2 font-bold text-2xl ${timerColor} ${state.timeLeft <= 5 ? 'animate-countdown' : ''}`}>
          <Clock className="w-5 h-5" />
          <span>{state.timeLeft}s</span>
        </div>

        <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            animate={{ width: `${timerPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col px-4 sm:px-6 py-6 max-w-4xl mx-auto w-full">
        <motion.div
          className="glass-card rounded-2xl p-6 sm:p-8 mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white text-shadow-game leading-tight">
            {question.text}
          </h2>
        </motion.div>

        {/* Option cards - Kahoot style grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-1">
          {question.options.map((option, i) => {
            const Icon = optionIcons[i];
            const isSelected = state.selectedOption === i;
            return (
              <motion.button
                key={i}
                onClick={() => selectOption(i)}
                className={`relative rounded-2xl p-5 sm:p-6 text-left transition-all duration-200 ${isSelected ? optionSelectedClasses[i] : optionColorClasses[i]} flex items-center gap-4 min-h-[80px] sm:min-h-[100px]`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${isSelected ? 'bg-white/30' : 'bg-white/15'} flex items-center justify-center transition-colors`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-white font-bold text-base sm:text-lg leading-snug flex-1">
                  {option}
                </span>
                {isSelected && (
                  <motion.div
                    className="absolute top-3 right-3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Submit button */}
        <motion.div
          className="mt-6 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={submitAnswer}
            disabled={state.selectedOption === null}
            className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg py-4 px-12 shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
            whileHover={state.selectedOption !== null ? { scale: 1.05, y: -2 } : {}}
            whileTap={state.selectedOption !== null ? { scale: 0.95 } : {}}
          >
            <Send className="w-5 h-5" />
            Submit Answer
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
