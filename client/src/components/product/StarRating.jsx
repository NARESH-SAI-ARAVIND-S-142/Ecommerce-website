import { useState } from 'react';
import { HiStar, HiOutlineStar } from 'react-icons/hi';

const StarRating = ({ rating, setRating, interactive = false, size = 'md' }) => {
  const [hover, setHover] = useState(0);

  const starSizes = {
    sm: 16,
    md: 20,
    lg: 28,
  };

  const currentSize = starSizes[size];

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hover || rating);

        return (
          <button
            key={index}
            type="button"
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            onClick={() => interactive && setRating(starValue)}
            onMouseEnter={() => interactive && setHover(starValue)}
            onMouseLeave={() => interactive && setHover(0)}
            disabled={!interactive}
            aria-label={`Rate ${starValue} stars`}
          >
            {isFilled ? (
              <HiStar size={currentSize} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
            ) : (
              <HiOutlineStar size={currentSize} className="text-gray-500" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
