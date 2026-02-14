"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { Zap, Users, Trophy, Sparkles } from 'lucide-react';

const shapes = [
  { className: 'w-16 h-16 rounded-full option-red', style: { top: '10%', left: '5%' } },
  { className: 'w-12 h-12 rounded-lg option-blue rotate-45', style: { top: '20%', right: '10%' } },
  { className: 'w-20 h-20 rounded-full option-yellow', style: { bottom: '15%', left: '8%' } },
  { className: 'w-14 h-14 rounded-lg option-green rotate-12', style: { bottom: '25%', right: '5%' } },
  { className: 'w-10 h-10 rounded-full bg-pink-500', style: { top: '50%', left: '15%' } },
  { className: 'w-8 h-8 rounded-lg bg-cyan-400 rotate-45', style: { top: '35%', right: '20%' } },
  { className: 'w-24 h-24 rounded-full bg-purple-600/30', style: { top: '60%', right: '15%' } },
  { className: 'w-6 h-6 rounded-full bg-orange-400', style: { top: '75%', left: '25%' } },
];

export default function LandingPage() {
  const { goToScreen, hostGame } = useGame();

  return (
    <div className="relative min-h-screen overflow-hidden game-gradient flex flex-col items-center justify-center px-4">
      {/* Animated background shapes */}
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className={`absolute opacity-40 ${shape.className} ${i % 3 === 0 ? 'animate-float' : i % 3 === 1 ? 'animate-float-delay' : 'animate-float-delay-2'}`}
          style={shape.style}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.6 }}
        />
      ))}

      {/* Geometric grid overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Main Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Logo / Icon */}
        <motion.div
          className="mb-6 relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl border border-white/20 animate-pulse-glow">
            <Zap className="w-12 h-12 text-white" fill="white" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-300 animate-bounce" />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-6xl sm:text-7xl md:text-8xl font-black text-white tracking-tight text-shadow-game mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Poll<span className="text-yellow-300">It!</span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-white/80 mb-2 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Real-time anonymous group polling
        </motion.p>

        <motion.p
          className="text-sm text-white/50 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Create polls, invite friends, get instant results
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            onClick={() => hostGame()}
            className="flex-1 relative group overflow-hidden rounded-2xl bg-white text-purple-700 font-bold text-lg py-5 px-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/50 to-pink-200/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center justify-center gap-3">
              <Trophy className="w-6 h-6" />
              Host Game
            </span>
          </motion.button>

          <motion.button
            onClick={() => goToScreen('join')}
            className="flex-1 relative group overflow-hidden rounded-2xl bg-white/15 backdrop-blur-md text-white font-bold text-lg py-5 px-8 border-2 border-white/30 shadow-xl transition-all duration-300 hover:bg-white/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="relative flex items-center justify-center gap-3">
              <Users className="w-6 h-6" />
              Join Game
            </span>
          </motion.button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="flex gap-8 mt-12 text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[
            { icon: Users, label: 'Players', value: '2.4K+' },
            { icon: Zap, label: 'Games', value: '850+' },
            { icon: Trophy, label: 'Questions', value: '5K+' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <Icon className="w-5 h-5" />
              <span className="text-xl font-bold text-white">{value}</span>
              <span className="text-xs">{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full">
          <path fill="rgba(255,255,255,0.05)" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
        </svg>
      </div>
    </div>
  );
}
