import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/notifications', {
        baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
        headers: { 'x-auth-token': token }
      });
      setNotifications(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Connect to Socket.IO and listen for notifications
  useEffect(() => {
    if (!isAuthenticated || !user?._id) return;
    // Connect to backend Socket.IO
    const socketUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
    const sock = io(socketUrl, {
      auth: { token },
      transports: ['websocket']
    });
    setSocket(sock);
    // Join user room for private notifications
    sock.emit('join', user._id);
    // Listen for notification events
    sock.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });
    // Cleanup
    return () => {
      sock.disconnect();
      setSocket(null);
    };
  }, [isAuthenticated, user?._id, token]);

  // Fetch notifications on mount/login
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated, token, fetchNotifications]);

  // Mark a notification as read
  const markAsRead = useCallback(async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`, {}, {
        baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
        headers: { 'x-auth-token': token }
      });
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      setError('Failed to mark as read');
    }
  }, [token]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await axios.put('/api/notifications/read-all', {}, {
        baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
        headers: { 'x-auth-token': token }
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      setError('Failed to mark all as read');
    }
  }, [token]);

  // Delete a notification
  const deleteNotification = useCallback(async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`, {
        baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
        headers: { 'x-auth-token': token }
      });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      setError('Failed to delete notification');
    }
  }, [token]);

  // Unread count
  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const value = useMemo(() => ({
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  }), [notifications, loading, error, unreadCount, fetchNotifications, markAsRead, markAllAsRead, deleteNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
}; 