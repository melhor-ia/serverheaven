"use client";

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ReviewFormProps {
  targetId: string;
  targetType: 'player_to_server' | 'server_to_player';
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ targetId, targetType, onReviewSubmitted }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to submit a review.");
      return;
    }
    if (rating === 0 || content.trim() === '') {
      setError("Please provide a rating and a comment.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          content,
          type: targetType,
          target_server_id: targetType === 'player_to_server' ? targetId : undefined,
          target_user_id: targetType === 'server_to_player' ? targetId : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit review.");
      }

      setRating(0);
      setContent('');
      onReviewSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return <p className="text-center text-gray-400">You must be logged in to leave a review.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg mt-6">
      <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label htmlFor="rating" className="block text-gray-300 mb-2">Rating</label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`cursor-pointer text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-400'}`}
              onClick={() => setRating(star)}
            >
              &#9733;
            </span>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="block text-gray-300 mb-2">Comment</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
          rows={4}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:bg-indigo-400"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm; 