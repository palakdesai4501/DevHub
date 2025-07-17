import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import NotificationItem from './NotificationItem';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  // Mock notifications data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockNotifications = [
        {
          _id: '1',
          type: 'like',
          fromUser: 'John Doe',
          message: 'John Doe liked your post',
          postId: 'post123',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
        },
        {
          _id: '2',
          type: 'comment',
          fromUser: 'Jane Smith',
          message: 'Jane Smith commented on your post',
          postId: 'post123',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
        },
        {
          _id: '3',
          type: 'follow',
          fromUser: 'Mike Johnson',
          message: 'Mike Johnson started following you',
          userId: 'user456',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
        },
        {
          _id: '4',
          type: 'like',
          fromUser: 'Sarah Wilson',
          message: 'Sarah Wilson liked your post',
          postId: 'post789',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
        }
      ];
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification._id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

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

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="container py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading notifications...</p>
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
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                {unreadCount} new
              </span>
            )}
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="text-blue-500 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mark all as read
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                filter === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                filter === 'unread'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                filter === 'read'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
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
                  onMarkAsRead={handleMarkAsRead}
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