import { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import api from '../utils/api';

// Initial state
const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: null
};

// Action types
const GET_POSTS = 'GET_POSTS';
const GET_POST = 'GET_POST';
const ADD_POST = 'ADD_POST';
const DELETE_POST = 'DELETE_POST';
const POST_ERROR = 'POST_ERROR';
const UPDATE_LIKES = 'UPDATE_LIKES';
const ADD_COMMENT = 'ADD_COMMENT';
const REMOVE_COMMENT = 'REMOVE_COMMENT';
const SET_LOADING = 'SET_LOADING';
const CLEAR_POST = 'CLEAR_POST';

// Reducer
const postsReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false,
        error: null
      };
    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false,
        error: null
      };
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
        loading: false,
        error: null
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== payload),
        loading: false,
        error: null
      };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map(post => 
          post._id === payload.id 
            ? { ...post, likes: payload.likes }
            : post
        ),
        post: state.post && state.post._id === payload.id 
          ? { ...state.post, likes: payload.likes }
          : state.post,
        loading: false,
        error: null
      };
    case ADD_COMMENT:
      return {
        ...state,
        post: { ...state.post, comments: payload },
        loading: false,
        error: null
      };
    case REMOVE_COMMENT:
      return {
        ...state,
        post: { ...state.post, comments: payload },
        loading: false,
        error: null
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true
      };
    case CLEAR_POST:
      return {
        ...state,
        post: null,
        loading: false,
        error: null
      };
    default:
      return state;
  }
};

// Create context
const PostsContext = createContext();

// Provider component
export const PostsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postsReducer, initialState);

  // Get all posts
  const getPosts = useCallback(async () => {
    try {
      dispatch({ type: SET_LOADING });
      const res = await api.get('/posts');
      dispatch({
        type: GET_POSTS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response?.statusText, status: err.response?.status }
      });
    }
  }, []);

  // Get single post
  const getPost = useCallback(async (id) => {
    try {
      dispatch({ type: SET_LOADING });
      const res = await api.get(`/posts/${id}`);
      dispatch({
        type: GET_POST,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response?.statusText, status: err.response?.status }
      });
    }
  }, []);

  // Add post
  const addPost = useCallback(async (formData) => {
    try {
      const res = await api.post('/posts', formData);
      dispatch({
        type: ADD_POST,
        payload: res.data
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response?.statusText, status: err.response?.status }
      });
      throw err;
    }
  }, []);

  // Delete post
  const deletePost = useCallback(async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      dispatch({
        type: DELETE_POST,
        payload: id
      });
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response?.statusText, status: err.response?.status }
      });
    }
  }, []);

  // Add like
  const addLike = useCallback(async (id) => {
    try {
      const res = await api.put(`/posts/like/${id}`);
      dispatch({
        type: UPDATE_LIKES,
        payload: { id, likes: res.data }
      });
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response?.statusText, status: err.response?.status }
      });
    }
  }, []);

  // Remove like
  const removeLike = useCallback(async (id) => {
    try {
      const res = await api.put(`/posts/unlike/${id}`);
      dispatch({
        type: UPDATE_LIKES,
        payload: { id, likes: res.data }
      });
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response?.statusText, status: err.response?.status }
      });
    }
  }, []);

  // Add comment
  const addComment = useCallback(async (postId, formData) => {
    try {
      const res = await api.post(`/posts/comment/${postId}`, formData);
      dispatch({
        type: ADD_COMMENT,
        payload: res.data
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response?.statusText, status: err.response?.status }
      });
      throw err;
    }
  }, []);

  // Delete comment
  const deleteComment = useCallback(async (postId, commentId) => {
    try {
      const res = await api.delete(`/posts/comment/${postId}/${commentId}`);
      dispatch({
        type: REMOVE_COMMENT,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response?.statusText, status: err.response?.status }
      });
    }
  }, []);

  // Clear post
  const clearPost = useCallback(() => {
    dispatch({ type: CLEAR_POST });
  }, []);

  // Memoize context value
  const contextValue = useMemo(() => ({
    posts: state.posts,
    post: state.post,
    loading: state.loading,
    error: state.error,
    getPosts,
    getPost,
    addPost,
    deletePost,
    addLike,
    removeLike,
    addComment,
    deleteComment,
    clearPost
  }), [
    state.posts,
    state.post,
    state.loading,
    state.error,
    getPosts,
    getPost,
    addPost,
    deletePost,
    addLike,
    removeLike,
    addComment,
    deleteComment,
    clearPost
  ]);

  return (
    <PostsContext.Provider value={contextValue}>
      {children}
    </PostsContext.Provider>
  );
};

// Custom hook to use posts context
export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};

export default PostsContext; 