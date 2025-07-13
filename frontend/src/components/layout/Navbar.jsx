import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCode, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, loading, logout } = useAuth();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const guestLinks = (
    <>
      <Link 
        to="/profiles" 
        className={`nav-link ${location.pathname === '/profiles' ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
      >
        Developers
      </Link>
      <Link 
        to="/register" 
        className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
      >
        <FaUserPlus className="icon" />
        <span className="hide-sm">Register</span>
      </Link>
      <Link 
        to="/login" 
        className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
      >
        <FaSignInAlt className="icon" />
        <span className="hide-sm">Login</span>
      </Link>
    </>
  );

  const authLinks = (
    <>
      <Link 
        to="/profiles" 
        className={`nav-link ${location.pathname === '/profiles' ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
      >
        Developers
      </Link>
      <Link 
        to="/posts" 
        className={`nav-link ${location.pathname === '/posts' ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
      >
        Posts
      </Link>
      <Link 
        to="/dashboard" 
        className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
      >
        <FaUser className="icon" />
        <span className="hide-sm">Dashboard</span>
      </Link>
      <a 
        href="#!" 
        className="nav-link" 
        onClick={handleLogout}
      >
        <FaSignOutAlt className="icon" />
        <span className="hide-sm">Logout</span>
      </a>
    </>
  );

  return (
    <nav className="navbar">
      <div className="container">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="navbar-brand">
            <FaCode className="brand-icon" />
            DevConnector
          </Link>
          
          <button 
            className="navbar-toggler" 
            onClick={toggleNavbar}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {!loading && (
            <div className={`navbar-nav ${isOpen ? 'active' : 'hidden'} md:flex`}>
              {isAuthenticated ? authLinks : guestLinks}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 