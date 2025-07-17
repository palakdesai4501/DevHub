import { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import api from '../utils/api';

// Initial state
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null
};

// Action types
const USER_LOADED = 'USER_LOADED';
const AUTH_ERROR = 'AUTH_ERROR';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAIL = 'LOGIN_FAIL';
const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
const REGISTER_FAIL = 'REGISTER_FAIL';
const LOGOUT = 'LOGOUT';

// Reducer
const authReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        token: payload.token,
        isAuthenticated: true,
        loading: false
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user
  const loadUser = useCallback(async () => {
    try {
      const res = await api.get('/auth');
      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
    }
  }, []);

  // Register user
  const register = useCallback(async (formData) => {
    try {
      const res = await api.post('/users', formData);
      
      // Store token immediately before calling loadUser
      localStorage.setItem('token', res.data.token);
      
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });
      
      // Load user after successful registration
      await loadUser();
    } catch (err) {
      dispatch({ type: REGISTER_FAIL });
      
      // Create detailed error message
      let errorMessage = 'Registration failed. ';
      if (err.response?.data?.errors) {
        errorMessage += err.response.data.errors.map(error => error.msg).join(', ');
      } else if (err.response?.data?.msg) {
        errorMessage += err.response.data.msg;
      } else {
        errorMessage += 'Please try again.';
      }
      
      throw new Error(errorMessage);
    }
  }, [loadUser]);

  // Login user
  const login = useCallback(async (email, password) => {
    try {
      const res = await api.post('/auth', { email, password });
      
      // Store token immediately before calling loadUser
      localStorage.setItem('token', res.data.token);
      
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
      
      // Load user after successful login
      await loadUser();
    } catch (err) {
      dispatch({ type: LOGIN_FAIL });
      
      // Create detailed error message
      let errorMessage = '';
      if (err.response?.data?.errors) {
        errorMessage = err.response.data.errors.map(error => error.msg).join(', ');
      } else if (err.response?.data?.msg) {
        errorMessage = err.response.data.msg;
      } else {
        errorMessage = 'Login failed. Please try again.';
      }
      
      throw new Error(errorMessage);
    }
  }, [loadUser]);

  // Logout
  const logout = useCallback(() => {
    dispatch({ type: LOGOUT });
  }, []);

  // Load user on app start if token exists
  useEffect(() => {
    if (localStorage.getItem('token')) {
      loadUser();
    } else {
      dispatch({ type: AUTH_ERROR });
    }
  }, [loadUser]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    user: state.user,
    register,
    login,
    logout,
    loadUser
  }), [state.token, state.isAuthenticated, state.loading, state.user, register, login, logout, loadUser]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 