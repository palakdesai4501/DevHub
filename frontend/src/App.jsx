import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import './App.css';

// Landing page component
const Landing = () => (
  <div className="landing">
    <div className="landing-content">
      <h1 className="text-5xl md:text-6xl font-bold mb-6">
        Developer Connector
      </h1>
      <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
        Create a developer profile/portfolio, share posts and get help from other developers
      </p>
      <div className="space-x-4">
        <a href="/register" className="btn btn-primary text-lg px-8 py-3">
          Sign Up
        </a>
        <a href="/login" className="btn btn-secondary text-lg px-8 py-3">
          Login
        </a>
      </div>
    </div>
  </div>
);

// Placeholder components - we'll create these next
const Register = () => (
  <div className="container py-20">
    <div className="max-w-md mx-auto">
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl font-bold text-center">Sign Up</h2>
          <p className="text-center text-gray-600 mt-2">Create Your Account</p>
        </div>
        <div className="card-body">
          <p className="text-center text-gray-500">Registration form coming soon...</p>
        </div>
      </div>
    </div>
  </div>
);

const Login = () => (
  <div className="container py-20">
    <div className="max-w-md mx-auto">
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl font-bold text-center">Sign In</h2>
          <p className="text-center text-gray-600 mt-2">Sign Into Your Account</p>
        </div>
        <div className="card-body">
          <p className="text-center text-gray-500">Login form coming soon...</p>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => (
  <div className="container py-20">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-body">
            <h3 className="text-xl font-semibold mb-2">Profile</h3>
            <p className="text-gray-600">Manage your developer profile</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h3 className="text-xl font-semibold mb-2">Posts</h3>
            <p className="text-gray-600">Share your thoughts</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h3 className="text-xl font-semibold mb-2">GitHub</h3>
            <p className="text-gray-600">Connect your repositories</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Profiles = () => (
  <div className="container py-20">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Developers</h1>
      <p className="text-center text-gray-600 mb-12 text-lg">
        Browse and connect with developers
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card">
            <div className="card-body text-center">
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
          <div key={i} className="card">
            <div className="card-body">
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/posts" element={<Posts />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
