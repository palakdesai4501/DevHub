import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const PostReactions = ({ post, onReaction }) => {
  const { user } = useAuth();
  const [showReactions, setShowReactions] = useState(false);

  const reactions = [
    { type: 'like', emoji: '👍', label: 'Like', color: 'text-blue-500' },
    { type: 'love', emoji: '❤️', label: 'Love', color: 'text-red-500' },
    { type: 'laugh', emoji: '😂', label: 'Haha', color: 'text-yellow-500' },
    { type: 'wow', emoji: '😮', label: 'Wow', color: 'text-purple-500' },
    { type: 'sad', emoji: '😢', label: 'Sad', color: 'text-blue-400' },
    { type: 'angry', emoji: '😠', label: 'Angry', color: 'text-red-600' }
  ];

  const getUserReaction = () => {
    return post.reactions?.find(reaction => reaction.user === user._id)?.type || null;
  };

  const getReactionCount = (type) => {
    return post.reactions?.filter(reaction => reaction.type === type).length || 0;
  };

  const handleReaction = (reactionType) => {
    const currentReaction = getUserReaction();
    
    if (currentReaction === reactionType) {
      // Remove reaction
      onReaction(post._id, null);
    } else {
      // Add or change reaction
      onReaction(post._id, reactionType);
    }
    
    setShowReactions(false);
  };

  const currentReaction = getUserReaction();
  const totalReactions = post.reactions?.length || 0;

  return (
    <div className="relative">
      {/* Reaction Button */}
      <button
        onClick={() => setShowReactions(!showReactions)}
        className={`flex items-center space-x-1 transition-colors ${
          currentReaction ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
        }`}
        title="React to this post"
      >
        {currentReaction ? (
          <span className="text-lg">
            {reactions.find(r => r.type === currentReaction)?.emoji}
          </span>
        ) : (
          <i className="fas fa-thumbs-up"></i>
        )}
        <span>{totalReactions > 0 ? totalReactions : 'React'}</span>
      </button>

      {/* Reactions Popup */}
      {showReactions && (
        <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
          <div className="flex space-x-1">
            {reactions.map((reaction) => (
              <button
                key={reaction.type}
                onClick={() => handleReaction(reaction.type)}
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                  currentReaction === reaction.type ? 'bg-blue-100' : ''
                }`}
                title={reaction.label}
              >
                <span className="text-xl">{reaction.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reaction Summary */}
      {totalReactions > 0 && (
        <div className="flex items-center space-x-1 mt-1">
          {reactions.map((reaction) => {
            const count = getReactionCount(reaction.type);
            if (count > 0) {
              return (
                <span key={reaction.type} className="text-xs">
                  {reaction.emoji} {count}
                </span>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default PostReactions; 