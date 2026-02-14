"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { Question } from '@/lib/game-store';
import {
  ArrowLeft, Copy, Users, Play, BarChart3, Plus, Trash2, Edit3, Check, X,
  Settings, ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';

export default function HostDashboard() {
  const { state, goToScreen, startGame, showResults, addQuestion, updateQuestion, deleteQuestion, resetGame } = useGame();
  const [copied, setCopied] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newQ, setNewQ] = useState({ text: '', options: ['', '', '', ''], timeLimit: 20 });
  const [expandedQ, setExpandedQ] = useState<string | null>(null);

  const copyCode = () => {
    navigator.clipboard.writeText(state.gameCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddQuestion = () => {
    if (!newQ.text.trim() || newQ.options.some(o => !o.trim())) return;
    addQuestion({
      id: Date.now().toString(),
      text: newQ.text,
      options: newQ.options,
      timeLimit: newQ.timeLimit,
    });
    setNewQ({ text: '', options: ['', '', '', ''], timeLimit: 20 });
    setShowAddForm(false);
  };

  const optionColors = ['option-red', 'option-blue', 'option-yellow', 'option-green'];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#1a0533]">
      {/* Gradient bg */}
      <div className="absolute inset-0 game-gradient opacity-40" />
      <div className="absolute inset-0 geometric-bg" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10">
        <button
          onClick={() => { resetGame(); goToScreen('landing'); }}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline font-medium">Exit</span>
        </button>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-300" />
          Host Dashboard
        </h1>
        <div className="w-16" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Game Code + Participants */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Game Code Card */}
          <motion.div
            className="glass-card rounded-2xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-white/60 text-sm font-medium mb-2">GAME CODE</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-[0.2em] text-shadow-game">
                {state.gameCode}
              </span>
              <button
                onClick={copyCode}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
              >
                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-white/40 text-xs mt-2">Share this code with players</p>
          </motion.div>

          {/* Participants Card */}
          <motion.div
            className="glass-card rounded-2xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-white/60 text-sm font-medium mb-2">PARTICIPANTS</p>
            <div className="flex items-center justify-center gap-3">
              <Users className="w-8 h-8 text-purple-300" />
              <span className="text-5xl font-black text-white text-shadow-game">{state.participants}</span>
            </div>
            <p className="text-white/40 text-xs mt-2">Players joined (anonymous)</p>
            <div className="flex justify-center mt-3 gap-1">
              {Array.from({ length: Math.min(state.participants, 12) }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full bg-purple-400/60"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                />
              ))}
              {state.participants > 12 && (
                <span className="text-white/40 text-xs ml-1">+{state.participants - 12}</span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={() => startGame()}
            className="flex-1 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg py-4 px-6 shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-6 h-6" fill="white" />
            Start Game
          </motion.button>
          <motion.button
            onClick={() => showResults()}
            className="flex-1 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg py-4 px-6 shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <BarChart3 className="w-6 h-6" />
            View Results
          </motion.button>
        </motion.div>

        {/* Questions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Questions ({state.questions.length})
            </h2>
            <motion.button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2 rounded-xl transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAddForm ? 'Cancel' : 'Add Question'}
            </motion.button>
          </div>

          {/* Add Question Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                className="glass-card rounded-2xl p-5 mb-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <input
                  value={newQ.text}
                  onChange={(e) => setNewQ({ ...newQ, text: e.target.value })}
                  placeholder="Type your question..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/30 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                />
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {newQ.options.map((opt, i) => (
                    <input
                      key={i}
                      value={opt}
                      onChange={(e) => {
                        const opts = [...newQ.options];
                        opts[i] = e.target.value;
                        setNewQ({ ...newQ, options: opts });
                      }}
                      placeholder={`Option ${i + 1}`}
                      className={`${optionColors[i]} rounded-xl p-3 text-white placeholder-white/50 font-medium focus:outline-none focus:ring-2 focus:ring-white/30`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/60">
                    <span className="text-sm">Time:</span>
                    <select
                      value={newQ.timeLimit}
                      onChange={(e) => setNewQ({ ...newQ, timeLimit: Number(e.target.value) })}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none"
                    >
                      {[10, 15, 20, 25, 30].map(t => (
                        <option key={t} value={t} className="bg-gray-800">{t}s</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleAddQuestion}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Question Cards */}
          <div className="space-y-3">
            {state.questions.map((q, idx) => (
              <motion.div
                key={q.id}
                className="glass-card rounded-2xl overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedQ(expandedQ === q.id ? null : q.id)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-sm">
                      {idx + 1}
                    </span>
                    <span className="text-white font-medium truncate">{q.text}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className="text-white/40 text-sm">{q.timeLimit}s</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteQuestion(q.id); }}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {expandedQ === q.id ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedQ === q.id && (
                    <motion.div
                      className="px-4 pb-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt, i) => (
                          <div key={i} className={`${optionColors[i]} rounded-xl px-4 py-3 text-white font-medium text-sm`}>
                            {opt}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
