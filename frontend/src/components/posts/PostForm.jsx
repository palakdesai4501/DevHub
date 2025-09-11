import { useState, useRef } from 'react';
import { usePosts } from '../../context/PostsContext';
import toast from 'react-hot-toast';

const PostForm = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef(null);
  const { addPost, loading } = usePosts();

  const categories = [
    { value: '', label: 'Select Category' },
    { value: 'technology', label: 'Technology', icon: '💻' },
    { value: 'programming', label: 'Programming', icon: '👨‍💻' },
    { value: 'design', label: 'Design', icon: '🎨' },
    { value: 'career', label: 'Career', icon: '💼' },
    { value: 'learning', label: 'Learning', icon: '📚' },
    { value: 'project', label: 'Project', icon: '🚀' },
    { value: 'discussion', label: 'Discussion', icon: '💬' },
    { value: 'news', label: 'News', icon: '📰' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size must be less than 5MB');
        return;
      }
      
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleImageUpload(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addTag = (e) => {
    e.preventDefault();
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('text', text);
      if (image) {
        formData.append('image', image);
      }
      if (category) {
        formData.append('category', category);
      }
      if (tags.length > 0) {
        formData.append('tags', JSON.stringify(tags));
      }

      await addPost(formData);
      setText('');
      setImage(null);
      setImagePreview('');
      setCategory('');
      setTags([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.success('Post created successfully!');
    } catch (err) {
      toast.error('Failed to create post. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-4 md:mb-6 card-animate">
      <h3 className="text-lg md:text-xl font-semibold mb-4">Create a Post</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          name="text"
          cols="30"
          rows="3"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 text-sm md:text-base"
          required={!image}
        />
        
        {/* Category and Tags */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 mb-4">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (max 5)
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag(e)}
                placeholder="Add tags..."
                className="flex-1 p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                maxLength="20"
              />
              <button
                type="button"
                onClick={addTag}
                disabled={!tagInput.trim() || tags.length >= 5}
                className="px-3 py-2 md:px-4 md:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 md:gap-2 mt-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs md:text-sm flex items-center space-x-1"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Image Upload Area */}
        <div className="mb-4">
          <div
            className={`border-2 border-dashed rounded-lg p-4 md:p-6 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full max-h-48 md:max-h-64 mx-auto rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center hover:bg-red-600 text-sm md:text-base"
                >
                  ×
                </button>
              </div>
            ) : (
              <div>
                <i className="fas fa-cloud-upload-alt text-3xl md:text-4xl text-gray-400 mb-2"></i>
                <p className="text-gray-600 mb-2 text-sm md:text-base">
                  Drag and drop an image here, or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-500 hover:text-blue-700 underline"
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs md:text-sm text-gray-500">Supports JPG, PNG, GIF up to 5MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 text-sm md:text-base"
              title="Add Image"
            >
              <i className="fas fa-image"></i>
            </button>
            <button
              type="button"
              onClick={() => setText('')}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 text-sm md:text-base"
              title="Clear Text"
            >
              <i className="fas fa-eraser"></i>
            </button>
          </div>
          
          <button
            type="submit"
            disabled={loading || uploading || (!text.trim() && !image)}
            className="bg-blue-500 text-white px-4 py-2 md:px-6 md:py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm md:text-base"
          >
            {loading || uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{uploading ? 'Uploading...' : 'Posting...'}</span>
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                <span>Post</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm; 