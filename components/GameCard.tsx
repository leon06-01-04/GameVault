import React from 'react';
import { Trash2, Edit, ImageIcon } from 'lucide-react';
import { Game } from '../types';
import { StarRating } from './StarRating';
import { StatusBadge } from './StatusBadge';

interface GameCardProps {
  game: Game;
  onEdit: (game: Game) => void;
  onDelete: (id: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onEdit, onDelete }) => {
  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:border-indigo-500/50 transition-all duration-300 group flex flex-col h-full">
      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
        {game.coverImage ? (
          <img 
            src={game.coverImage} 
            alt={game.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600">
            <ImageIcon size={48} />
          </div>
        )}
        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button 
            onClick={() => onEdit(game)}
            className="p-2 bg-slate-900/90 text-indigo-400 rounded-full hover:bg-indigo-600 hover:text-white transition-colors"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => onDelete(game.id)}
            className="p-2 bg-slate-900/90 text-red-400 rounded-full hover:bg-red-600 hover:text-white transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <div className="absolute bottom-2 left-2">
            <StatusBadge status={game.status} />
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-white leading-tight line-clamp-1" title={game.title}>
            {game.title}
          </h3>
        </div>
        
        <p className="text-sm text-indigo-300 font-medium mb-2">{game.genre || 'Unspecified Genre'}</p>
        
        <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-1">
          {game.description || "No description provided."}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-700/50">
           <StarRating rating={game.rating} readonly size={16} />
           {game.gallery.length > 0 && (
             <span className="text-xs text-slate-500 flex items-center gap-1">
                <ImageIcon size={12} /> {game.gallery.length} photos
             </span>
           )}
        </div>
      </div>
    </div>
  );
};