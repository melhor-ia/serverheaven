"use client";

import React from 'react';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, totalStars = 5 }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="text-yellow-400">&#9733;</span>
      ))}
      {halfStar && <span className="text-yellow-400">&#9733;</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="text-gray-400">&#9734;</span>
      ))}
    </div>
  );
};

export default StarRating; 