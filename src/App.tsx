/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameEngine, Player, BoardState } from './logic/GameEngine';
import { RotateCcw } from 'lucide-react';

export default function App() {
  const [engine] = useState(() => new GameEngine());
  const [board, setBoard] = useState<BoardState>(engine.getBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(engine.getCurrentPlayer());
  const [winner, setWinner] = useState<Player | 'Draw' | null>(engine.getWinner());
  const [winningLine, setWinningLine] = useState<number[] | null>(engine.getWinningLine());

  const handleCellClick = useCallback((index: number) => {
    if (engine.makeMove(index)) {
      setBoard(engine.getBoard());
      setCurrentPlayer(engine.getCurrentPlayer());
      setWinner(engine.getWinner());
      setWinningLine(engine.getWinningLine());
    }
  }, [engine]);

  const handleRestart = useCallback(() => {
    engine.reset();
    setBoard(engine.getBoard());
    setCurrentPlayer(engine.getCurrentPlayer());
    setWinner(engine.getWinner());
    setWinningLine(engine.getWinningLine());
  }, [engine]);

  const statusText = useMemo(() => {
    if (winner === 'Draw') return "It's a Draw!";
    if (winner) return `Player ${winner} Wins!`;
    return `${currentPlayer} Turn`;
  }, [winner, currentPlayer]);

  return (
    <div className="flex flex-col items-center justify-center min-vh-100 w-full bg-slate-50 font-sans p-4 overflow-hidden">
      {/* Top Bar */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md bg-slate-900 text-white py-4 px-6 rounded-t-2xl shadow-xl flex justify-between items-center z-10"
      >
        <span className="text-xl font-bold tracking-tight">Tic Tac Toe</span>
        <motion.div 
          key={statusText}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-widest ${
            winner ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-300'
          }`}
        >
          {statusText}
        </motion.div>
      </motion.div>

      {/* Game Board Container */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md aspect-square bg-teal-600 shadow-2xl p-4 md:p-6"
      >
        <div className="grid grid-cols-3 gap-3 w-full h-full relative">
          {board.map((cell, idx) => {
            const isWinningCell = winningLine?.includes(idx);
            
            return (
              <motion.button
                key={idx}
                onClick={() => handleCellClick(idx)}
                whileHover={!cell && !winner ? { backgroundColor: 'rgba(255,255,255,0.1)' } : {}}
                whileTap={!cell && !winner ? { scale: 0.95 } : {}}
                className={`relative flex items-center justify-center rounded-lg text-6xl md:text-7xl font-black transition-colors duration-300 ${
                  isWinningCell ? 'bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-teal-700/30'
                }`}
                disabled={!!cell || !!winner}
              >
                <AnimatePresence mode="wait">
                  {cell && (
                    <motion.span
                      key={cell}
                      initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      className={cell === 'X' ? 'text-slate-900' : 'text-teal-50'}
                    >
                      {cell}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {/* Horizontal/Vertical/Diagonal win line overlays could go here, 
                    but the cell highlight is cleaner for minimal design */}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Bottom Action Bar */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md bg-white py-6 px-4 rounded-b-2xl shadow-xl flex flex-col items-center gap-4"
      >
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg group"
        >
          <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          Restart Game
        </button>
        
        <div className="flex gap-8 text-slate-400 text-xs font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-900 rounded-sm"></div>
            <span>Player X</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-teal-100 rounded-sm"></div>
            <span>Player O</span>
          </div>
        </div>
      </motion.div>

      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-900 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

