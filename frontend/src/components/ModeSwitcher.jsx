import React from 'react';
import { Infinity, Brain } from 'lucide-react';
import { MODES, modeInfo } from '../data/data';

export default function ModeSwitcher({ currentMode, onModeChange }) {
  return (
    <div className="fixed top-20 right-6 z-40 flex flex-col gap-2">
      <div className="bg-gray-800/90 backdrop-blur-lg rounded-xl p-2 border border-gray-700 shadow-xl">
        <div className="text-xs text-gray-400 text-center mb-2 px-2">View as</div>
        <div className="flex flex-col gap-1">
          {Object.entries(modeInfo).map(([mode, info]) => (
            <button
              key={mode}
              onClick={() => onModeChange(mode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${currentMode === mode
                ? mode === MODES.DEVOPS
                  ? 'bg-cyan-500 text-gray-900 shadow-lg shadow-cyan-500/30'
                  : 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                }`}
            >
              {mode === MODES.DEVOPS ? (
                <Infinity size={16} />
              ) : (
                <Brain size={16} />
              )}
              <span>{info.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Current mode indicator */}
      <div className={`text-center text-xs px-3 py-1 rounded-full ${currentMode === MODES.DEVOPS
        ? 'bg-cyan-500/20 text-cyan-400'
        : 'bg-purple-500/20 text-purple-400'
        }`}>
        {modeInfo[currentMode]?.description}
      </div>
    </div>
  );
}
