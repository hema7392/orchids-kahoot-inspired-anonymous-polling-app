"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { BarChart3, Home, ChevronLeft, ChevronRight, Trophy, Users, PieChart } from 'lucide-react';

const barColors = [
  'from-red-500 to-red-400',
  'from-blue-500 to-blue-400',
  'from-yellow-500 to-yellow-400',
  'from-green-500 to-green-400',
];

const bgColors = ['bg-red-500/20', 'bg-blue-500/20', 'bg-yellow-500/20', 'bg-green-500/20'];
const textColors = ['text-red-400', 'text-blue-400', 'text-yellow-400', 'text-green-400'];

export default function ResultsScreen() {
  const { state, resetGame, goToScreen } = useGame();
  const [viewIdx, setViewIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'bar' | 'detail'>('bar');

  const question = state.questions[viewIdx];
  const answerData = state.answers[question?.id] || [];
  const totalResponses = answerData.length;

  // Count per option
  const counts = question?.options.map((_, i) => answerData.filter(a => a === i).length) || [];
  const maxCount = Math.max(...counts, 1);

  const handleBack = () => {
    resetGame();
    goToScreen('landing');
  };

  if (!question) {
    return (
      <div className="min-h-screen game-gradient flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 text-lg mb-4">No results available</p>
          <button onClick={handleBack} className="text-white underline">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a0533] relative overflow-hidden">
      <div className="absolute inset-0 game-gradient opacity-30" />
      <div className="absolute inset-0 geometric-bg" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10 bg-black/20">
        <button onClick={handleBack} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-medium">
          <Home className="w-5 h-5" />
          <span className="hidden sm:inline">Home</span>
        </button>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-yellow-400" />
          Results
        </h1>
        <div className="flex items-center gap-2 text-white/60">
          <Users className="w-4 h-4" />
          <span className="text-sm font-medium">{totalResponses} votes</span>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-4 sm:p-6">
        {/* Question navigation */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={() => setViewIdx(Math.max(0, viewIdx - 1))}
            disabled={viewIdx === 0}
            className="p-2 rounded-xl bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <div className="text-center">
            <p className="text-white/50 text-sm">Question {viewIdx + 1} of {state.questions.length}</p>
            <div className="flex justify-center gap-1.5 mt-2">
              {state.questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setViewIdx(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === viewIdx ? 'bg-yellow-400 scale-125' : 'bg-white/20 hover:bg-white/40'}`}
                />
              ))}
            </div>
          </div>

          <motion.button
            onClick={() => setViewIdx(Math.min(state.questions.length - 1, viewIdx + 1))}
            disabled={viewIdx === state.questions.length - 1}
            className="p-2 rounded-xl bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Question Card */}
        <motion.div
          key={viewIdx}
          className="glass-card rounded-2xl p-6 sm:p-8 mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white text-shadow-game leading-tight">
            {question.text}
          </h2>
        </motion.div>

        {/* View mode toggle */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setViewMode('bar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${viewMode === 'bar' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/70'}`}
          >
            <BarChart3 className="w-4 h-4" />
            Bar Chart
          </button>
          <button
            onClick={() => setViewMode('detail')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${viewMode === 'detail' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/70'}`}
          >
            <PieChart className="w-4 h-4" />
            Detailed
          </button>
        </div>

        {/* Results visualization */}
        {viewMode === 'bar' ? (
          <div className="space-y-4">
            {question.options.map((option, i) => {
              const count = counts[i];
              const pct = totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;
              const isWinner = count === maxCount && count > 0;

              return (
                <motion.div
                  key={i}
                  className={`glass-card rounded-2xl p-4 sm:p-5 ${isWinner ? 'ring-2 ring-yellow-400/50' : ''}`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${bgColors[i]} flex items-center justify-center`}>
                        <span className={`font-bold ${textColors[i]}`}>{String.fromCharCode(65 + i)}</span>
                      </div>
                      <span className="text-white font-bold text-sm sm:text-base">{option}</span>
                      {isWinner && <Trophy className="w-5 h-5 text-yellow-400" />}
                    </div>
                    <div className="text-right">
                      <span className="text-white font-black text-lg">{pct}%</span>
                      <span className="text-white/40 text-sm ml-2">({count})</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${barColors[i]}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Detailed view - visual blocks */
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {question.options.map((option, i) => {
              const count = counts[i];
              const pct = totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;
              const isWinner = count === maxCount && count > 0;

              return (
                <motion.div
                  key={i}
                  className={`${['option-red', 'option-blue', 'option-yellow', 'option-green'][i]} rounded-2xl p-5 sm:p-6 text-center relative overflow-hidden ${isWinner ? 'ring-3 ring-yellow-400' : ''}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                >
                  {isWinner && (
                    <motion.div
                      className="absolute top-2 right-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring' }}
                    >
                      <Trophy className="w-6 h-6 text-yellow-300" />
                    </motion.div>
                  )}
                  <p className="text-white font-bold text-sm sm:text-base mb-3">{option}</p>
                  <motion.p
                    className="text-5xl sm:text-6xl font-black text-white text-shadow-game"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                  >
                    {pct}%
                  </motion.p>
                  <p className="text-white/60 text-sm mt-1">{count} votes</p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Summary card */}
        <motion.div
          className="glass-card rounded-2xl p-6 mt-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-white/50 text-sm mb-1">Total Responses</p>
          <p className="text-3xl font-black text-white">{totalResponses}</p>
          <p className="text-white/40 text-xs mt-1">All responses are anonymous</p>
        </motion.div>

        {/* Home button */}
        <motion.div
          className="flex justify-center mt-8 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={handleBack}
            className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg py-4 px-10 shadow-xl flex items-center gap-2"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home className="w-5 h-5" />
            Back to Home
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
