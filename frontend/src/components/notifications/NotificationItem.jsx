import { useNavigate } from 'react-router-dom';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return '👍';
      case 'comment':
        return '💬';
      case 'follow':
        return '👤';
      default:
        return '🔔';
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification._id);
    }
    if (notification.post) {
      navigate(`/posts/${notification.post}`);
    } else if (notification.type === 'follow' && notification.from) {
      navigate(`/profile/${notification.from}`);
    }
  };

  return (
    <div 
      className={`p-4 border-l-4 cursor-pointer transition-colors card-animate ${
        notification.read 
          ? 'bg-gray-50 border-gray-200' 
          : 'bg-blue-50 border-blue-500'
      } hover:bg-gray-100`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
        <div className="flex-1">
          <p className="text-gray-800 font-medium">
            {notification.message}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {formatDate(notification.createdAt)}
          </p>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem; 