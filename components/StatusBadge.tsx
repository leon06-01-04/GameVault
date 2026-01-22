import React from 'react';
import { GameStatus } from '../types';

interface StatusBadgeProps {
  status: GameStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = (s: GameStatus) => {
    switch (s) {
      case GameStatus.Finished:
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case GameStatus.InProgress:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case GameStatus.Abandoned:
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case GameStatus.NotStarted:
      default:
        return 'bg-slate-600/20 text-slate-400 border-slate-600/30';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles(status)}`}>
      {status}
    </span>
  );
};