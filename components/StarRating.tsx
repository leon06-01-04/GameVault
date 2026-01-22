import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  onRate, 
  readonly = false,
  size = 20 
}) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRate && onRate(star)}
          disabled={readonly}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}`}
        >
          <Star
            size={size}
            className={`${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-slate-600 hover:text-slate-500'
            } transition-colors duration-200`}
          />
        </button>
      ))}
    </div>
  );
};