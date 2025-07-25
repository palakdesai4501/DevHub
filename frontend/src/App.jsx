import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { PostsProvider } from './context/PostsContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/routing/ProtectedRoute';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import ProfileForm from './components/profile/ProfileForm';
import ProfileDetail from './components/profile/ProfileDetail';
import AddExperience from './components/profile/AddExperience';
import AddEducation from './components/profile/AddEducation';
import Profiles from './components/profiles/Profiles';
import Posts from './components/posts/Posts';
import PostDetail from './components/posts/PostDetail';
import UserPosts from './components/posts/UserPosts';
import Notifications from './components/notifications/Notifications';
import './App.css';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'react-hot-toast';

// Landing page component
const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="landing">
      <div className="landing-content">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Developer Connector
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Create a developer profile, share posts and get help from other developers
        </p>
        <div className="space-x-4">
          <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
            Sign Up
          </Link>
          <Link to="/login" className="btn btn-secondary text-lg px-8 py-3">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

// Profile form components
const CreateProfile = () => <ProfileForm />;
const EditProfile = () => <ProfileForm edit={true} />;



function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <PostsProvider>
          <NotificationProvider>
          <Router>
            <div className="App">
              <Toaster position="top-right" toastOptions={{
                style: { borderRadius: '0.75rem', background: 'var(--color-white)', color: 'var(--color-primary)', boxShadow: '0 2px 16px var(--color-shadow)' },
                success: { background: 'var(--color-secondary)', color: 'var(--color-white)' },
                error: { background: '#ef4444', color: 'var(--color-white)' },
              }} />
              <Navbar />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/create-profile" 
                  element={
                    <ProtectedRoute>
                      <CreateProfile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/edit-profile" 
                  element={
                    <ProtectedRoute>
                      <EditProfile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/add-experience" 
                  element={
                    <ProtectedRoute>
                      <AddExperience />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/add-education" 
                  element={
                    <ProtectedRoute>
                      <AddEducation />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/profiles" element={<Profiles />} />
                <Route path="/profile/:id" element={<ProfileDetail />} />
                <Route 
                  path="/posts" 
                  element={
                    <ProtectedRoute>
                      <Posts />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/posts/:id" 
                  element={
                    <ProtectedRoute>
                      <PostDetail />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/notifications" 
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/user/:userId/posts" 
                  element={
                    <ProtectedRoute>
                      <UserPosts />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </div>
          </Router>
          </NotificationProvider>
        </PostsProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;
