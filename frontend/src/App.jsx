import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/routing/ProtectedRoute';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import './App.css';

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
          Create a developer profile/portfolio, share posts and get help from other developers
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

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="container py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Dashboard {user && `- Welcome ${user.name}!`}
        </h1>
        
        {/* Debug info */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800">Debug Info:</h3>
          <p className="text-blue-700">Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <p className="text-blue-700">User: {user ? user.name : 'Not loaded'}</p>
          <p className="text-blue-700">Loading: {loading ? 'Yes' : 'No'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Profile</h3>
            <p className="text-gray-600">Manage your developer profile</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Edit Profile
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Posts</h3>
            <p className="text-gray-600">Share your thoughts</p>
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Create Post
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">GitHub</h3>
            <p className="text-gray-600">Connect your repositories</p>
            <button className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              Connect GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Profiles = () => (
  <div className="container py-20">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Developers</h1>
      <p className="text-center text-gray-600 mb-12 text-lg">
        Browse and connect with developers
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Developer {i}</h3>
              <p className="text-gray-600 mb-4">Full Stack Developer</p>
              <div className="flex justify-center space-x-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">React</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Node.js</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Posts = () => (
  <div className="container py-20">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Posts</h1>
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <h4 className="font-semibold">Developer {i}</h4>
                <p className="text-gray-500 text-sm">2 hours ago</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              This is a sample post from developer {i}. Great discussion about React hooks!
            </p>
            <div className="flex space-x-4 text-gray-500">
              <button className="hover:text-blue-500">👍 Like</button>
              <button className="hover:text-blue-500">💬 Comment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
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
            <Route path="/profiles" element={<Profiles />} />
            <Route 
              path="/posts" 
              element={
                <ProtectedRoute>
                  <Posts />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
