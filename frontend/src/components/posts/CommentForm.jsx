import { useState } from 'react';
import { usePosts } from '../../context/PostsContext';

const CommentForm = ({ postId }) => {
  const [text, setText] = useState('');
  const { addComment, loading } = usePosts();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await addComment(postId, { text });
      setText('');
    } catch (err) {
      // Error is handled in context
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h3 className="text-lg font-semibold mb-3">Add a Comment</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          name="text"
          cols="30"
          rows="3"
          placeholder="Comment on this post"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Commenting...' : 'Comment'}
        </button>
      </form>
    </div>
  );
};

export default CommentForm; 