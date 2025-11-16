import React from 'react';
import { Sentiment } from '@/@types/journal';

interface EmotionDotProps {
  sentiment?: Sentiment;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const EmotionDot: React.FC<EmotionDotProps> = ({ sentiment, size = 'md', className = '' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'w-2 h-2';
      case 'lg':
        return 'w-4 h-4';
      default:
        return 'w-3 h-3';
    }
  };

  const getColorClass = () => {
    if (!sentiment) return 'bg-gray-300';
    
    switch (sentiment) {
      case Sentiment.POSITIVE:
        return 'bg-green-500';
      case Sentiment.NEUTRAL:
        return 'bg-gray-400';
      case Sentiment.NEGATIVE:
        return 'bg-orange-500';
      case Sentiment.VERY_NEGATIVE:
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div
      className={`rounded-full ${getSizeClass()} ${getColorClass()} ${className}`}
      title={sentiment || 'No analysis'}
    />
  );
};

export default EmotionDot;

