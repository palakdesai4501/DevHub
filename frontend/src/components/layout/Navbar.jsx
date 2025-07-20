import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {
  const { isAuthenticated, logout, user, loading } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const onLogout = () => {
    logout();
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    setDropdownOpen(false);
    if (notification.post) {
      navigate(`/posts/${notification.post}`);
    } else if (notification.type === 'follow' && notification.from) {
      navigate(`/profile/${notification.from}`);
    }
  };

  const authLinks = (
    <ul className="flex items-center space-x-6">
      <li>
        <Link 
          to="/profiles" 
          className={`text-white hover:text-gray-300 transition-colors ${
            location.pathname === '/profiles' ? 'text-yellow-300' : ''
          }`}
        >
          Developers
        </Link>
      </li>
      <li>
        <Link 
          to="/posts" 
          className={`text-white hover:text-gray-300 transition-colors ${
            location.pathname === '/posts' ? 'text-yellow-300' : ''
          }`}
        >
          Posts
        </Link>
      </li>
      <li className="relative" ref={dropdownRef}>
        <button
          className={`text-white hover:text-gray-300 transition-colors relative focus:outline-none`}
          onClick={() => setDropdownOpen((open) => !open)}
          aria-label="Notifications"
        >
          <i className="fas fa-bell text-lg"></i>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
            <div className="p-4 border-b flex items-center justify-between">
              <span className="font-semibold text-gray-700">Notifications</span>
              <Link
                to="/notifications"
                className="text-blue-500 hover:underline text-sm"
                onClick={() => setDropdownOpen(false)}
              >
                View all
              </Link>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No notifications</div>
              ) : (
                notifications.slice(0, 6).map((notification) => (
                  <button
                    key={notification._id}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:outline-none ${!notification.read ? 'bg-blue-50' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">
                        {notification.type === 'like' && '👍'}
                        {notification.type === 'comment' && '💬'}
                        {notification.type === 'follow' && '👤'}
                        {!['like','comment','follow'].includes(notification.type) && '🔔'}
                      </span>
                      <div className="flex-1">
                        <div className="text-gray-800 text-sm">
                          {notification.message}
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </div>
                      </div>
                      {!notification.read && <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </li>
      <li>
        <Link 
          to="/dashboard" 
          className={`text-white hover:text-gray-300 transition-colors ${
            location.pathname === '/dashboard' ? 'text-yellow-300' : ''
          }`}
        >
          <i className="fas fa-user mr-1"></i>
          Dashboard
        </Link>
      </li>
      <li>
        <button
          onClick={onLogout}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <i className="fas fa-sign-out-alt mr-1"></i>
          Logout
        </button>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul className="flex items-center space-x-6">
      <li>
        <Link 
          to="/profiles" 
          className={`text-white hover:text-gray-300 transition-colors ${
            location.pathname === '/profiles' ? 'text-yellow-300' : ''
          }`}
        >
          Developers
        </Link>
      </li>
      <li>
        <Link 
          to="/register" 
          className={`text-white hover:text-gray-300 transition-colors ${
            location.pathname === '/register' ? 'text-yellow-300' : ''
          }`}
        >
          Register
        </Link>
      </li>
      <li>
        <Link 
          to="/login" 
          className={`text-white hover:text-gray-300 transition-colors ${
            location.pathname === '/login' ? 'text-yellow-300' : ''
          }`}
        >
          Login
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <i className="fas fa-code text-white text-xl mr-2"></i>
              <span className="text-white text-xl font-bold">DevConnector</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            {/* Show user name if authenticated */}
            {!loading && isAuthenticated && user && (
              <span className="text-white mr-4">
                Welcome, {user.name}!
              </span>
            )}
            {/* Show different links based on auth status */}
            {!loading && (
              <>
                {isAuthenticated ? authLinks : guestLinks}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 