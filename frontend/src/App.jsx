import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/routing/ProtectedRoute';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import ProfileForm from './components/profile/ProfileForm';
import Profiles from './components/profiles/Profiles';
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

// Profile form components
const CreateProfile = () => <ProfileForm />;
const EditProfile = () => <ProfileForm edit={true} />;

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
      <ProfileProvider>
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
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;
