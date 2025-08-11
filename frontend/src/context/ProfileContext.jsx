import { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import api from '../utils/api';

// Initial state
const initialState = {
  profile: null,
  profiles: [],
  loading: true,
  error: null
};

// Action types
const GET_PROFILE = 'GET_PROFILE';
const GET_PROFILES = 'GET_PROFILES';
const PROFILE_ERROR = 'PROFILE_ERROR';
const CLEAR_PROFILE = 'CLEAR_PROFILE';
const UPDATE_PROFILE = 'UPDATE_PROFILE';
const SET_LOADING = 'SET_LOADING';

// Reducer
const profileReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
        error: null
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false,
        error: null
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        profile: null
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        profiles: [],
        loading: false,
        error: null
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
};

// Create context
const ProfileContext = createContext();

// Provider component
export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  // Get current user's profile
  const getCurrentProfile = useCallback(async () => {
    try {
      dispatch({ type: SET_LOADING });
      const res = await api.get('/profile/me');
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response?.statusText, status: err.response?.status }
      });
    }
  }, []);

  // Get all profiles
  const getProfiles = useCallback(async () => {
    try {
      dispatch({ type: SET_LOADING });
      const res = await api.get('/profile');
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response?.statusText, status: err.response?.status }
      });
    }
  }, []);

  // Get profile by ID
  const getProfileById = useCallback(async (userId) => {
    try {
      dispatch({ type: SET_LOADING });
      const res = await api.get(`/profile/user/${userId}`);
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response?.statusText, status: err.response?.status }
      });
    }
  }, []);

  // Create or update profile
  const createProfile = useCallback(async (formData) => {
    try {
      const res = await api.post('/profile', formData);
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response?.statusText, status: err.response?.status }
      });
      throw err;
    }
  }, []);

  // Add experience
  const addExperience = useCallback(async (formData) => {
    try {
      const res = await api.put('/profile/experience', formData);
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response?.statusText, status: err.response?.status }
      });
      throw err;
    }
  }, []);

  // Delete experience
  const deleteExperience = useCallback(async (id) => {
    try {
      const res = await api.delete(`/profile/experience/${id}`);
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response?.statusText, status: err.response?.status }
      });
    }
  }, []);

  // Add education
  const addEducation = useCallback(async (formData) => {
    try {
      const res = await api.put('/profile/education', formData);
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response?.statusText, status: err.response?.status }
      });
      throw err;
    }
  }, []);

  // Delete education
  const deleteEducation = useCallback(async (id) => {
    try {
      const res = await api.delete(`/profile/education/${id}`);
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response?.statusText, status: err.response?.status }
      });
    }
  }, []);

  // Delete account & profile
  const deleteAccount = useCallback(async () => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      try {
        await api.delete('/profile');
        // Clear profile state
        dispatch({ type: CLEAR_PROFILE });
        // Remove auth token so user is fully logged out
        localStorage.removeItem('token');
        // Redirect to login
        window.location.href = '/login';
      } catch (err) {
        dispatch({
          type: PROFILE_ERROR,
          payload: { msg: err.response?.statusText, status: err.response?.status }
        });
      }
    }
  }, []);

  // Clear profile
  const clearProfile = useCallback(() => {
    dispatch({ type: CLEAR_PROFILE });
  }, []);

  // Memoize context value
  const contextValue = useMemo(() => ({
    profile: state.profile,
    profiles: state.profiles,
    loading: state.loading,
    error: state.error,
    getCurrentProfile,
    getProfiles,
    getProfileById,
    createProfile,
    addExperience,
    deleteExperience,
    addEducation,
    deleteEducation,
    deleteAccount,
    clearProfile
  }), [
    state.profile,
    state.profiles,
    state.loading,
    state.error,
    getCurrentProfile,
    getProfiles,
    getProfileById,
    createProfile,
    addExperience,
    deleteExperience,
    addEducation,
    deleteEducation,
    deleteAccount,
    clearProfile
  ]);

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook to use profile context
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export default ProfileContext; 