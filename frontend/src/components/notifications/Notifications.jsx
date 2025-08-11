import { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import NotificationItem from './NotificationItem';

const Notifications = () => {
  const {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll
  } = useNotification();
  const [filter, setFilter] = useState('all'); // all, unread, read

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'read':
        return notification.read;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="container py-20">
        <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderBottomColor: 'var(--color-primary)' }}></div>
            <p className="mt-4 text-gray-600">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <div className="flex items-center space-x-4">
            {unreadCount > 0 && (
              <span className="px-3 py-1 rounded-full text-sm text-white" style={{ background: 'var(--color-primary)' }}>
                {unreadCount} new
              </span>
            )}
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: 'var(--color-primary)' }}
            >
              Mark all as read
            </button>
            <button
              onClick={clearAll}
              disabled={unreadCount > 0 || notifications.length === 0}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: 'var(--color-primary)' }}
              title={unreadCount > 0 ? 'Mark all as read first' : 'Clear all notifications'}
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                filter === 'all' ? '' : 'text-gray-500 hover:text-gray-700'
              }`}
              style={filter === 'all' ? { color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary)' } : undefined}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                filter === 'unread' ? '' : 'text-gray-500 hover:text-gray-700'
              }`}
              style={filter === 'unread' ? { color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary)' } : undefined}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                filter === 'read' ? '' : 'text-gray-500 hover:text-gray-700'
              }`}
              style={filter === 'read' ? { color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary)' } : undefined}
            >
              Read ({notifications.length - unreadCount})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {filter === 'all' 
                  ? 'No notifications yet'
                  : filter === 'unread'
                  ? 'No unread notifications'
                  : 'No read notifications'
                }
              </h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? 'You\'ll see notifications here when people interact with your content.'
                  : 'Check back later for new notifications.'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map(notification => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications; 