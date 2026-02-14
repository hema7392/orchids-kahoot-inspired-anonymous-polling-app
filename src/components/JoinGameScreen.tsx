"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { ArrowLeft, Gamepad2, User, Hash, ArrowRight } from 'lucide-react';

export default function JoinGameScreen() {
  const { joinGame, goToScreen } = useGame();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = () => {
    setIsJoining(true);
    setTimeout(() => {
      joinGame(code, name);
    }, 800);
  };

  return (
    <div className="relative min-h-screen overflow-hidden game-gradient flex flex-col items-center justify-center px-4">
      {/* Floating shapes */}
      <motion.div className="absolute w-32 h-32 rounded-full option-red opacity-20 animate-float" style={{ top: '10%', right: '10%' }}
        initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} transition={{ delay: 0.2 }} />
      <motion.div className="absolute w-20 h-20 rounded-2xl option-blue opacity-20 rotate-45 animate-float-delay" style={{ bottom: '20%', left: '8%' }}
        initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} transition={{ delay: 0.3 }} />
      <motion.div className="absolute w-16 h-16 rounded-full option-yellow opacity-20 animate-float-delay-2" style={{ top: '40%', left: '5%' }}
        initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} transition={{ delay: 0.4 }} />
      <motion.div className="absolute w-24 h-24 rounded-lg option-green opacity-15 rotate-12 animate-float" style={{ bottom: '10%', right: '15%' }}
        initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ delay: 0.5 }} />

      {/* Grid */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Back button */}
      <motion.button
        onClick={() => goToScreen('landing')}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/70 hover:text-white transition-colors font-medium"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -4 }}
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </motion.button>

      {/* Card */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <Gamepad2 className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-black text-white text-shadow-game">Join Game</h2>
            <p className="text-white/60 text-sm mt-1">Enter the game code to play</p>
          </div>

          {/* Input fields */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="text-white/70 text-sm font-medium mb-2 block">Game Code</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/30 font-bold text-lg tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="text-white/70 text-sm font-medium mb-2 block">Nickname <span className="text-white/40">(optional)</span></label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Cool nickname"
                  maxLength={20}
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/30 font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all"
                />
              </div>
            </motion.div>
          </div>

          {/* Join button */}
          <motion.button
            onClick={handleJoin}
            disabled={isJoining}
            className="w-full mt-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg py-5 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {isJoining ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                />
                Joining...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Join Game
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </motion.button>

          {/* Privacy note */}
          <p className="text-white/40 text-xs text-center mt-4">
            Your identity stays anonymous throughout the game
          </p>
        </div>
      </motion.div>
    </div>
  );
}
