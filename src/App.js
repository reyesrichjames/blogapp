import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
// import Movies from './pages/Movies';
// import MovieView from './pages/MovieView';
import Posts from './pages/Posts';
import PostView from './pages/PostView';
import NavBar from './components/NavBar';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
    email: null
  });
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token on app load:', token);
    
    if (token) {
      try {
        // Decode the JWT to get user info
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Decoded token payload:', payload);
          
          setUser({
            id: payload.id,
            isAdmin: payload.isAdmin,
            email: payload.email,
            username: payload.username || null
          });
        } else {
          // Invalid token format, remove it
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Token decoding error:', err);
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <UserProvider value={{ user, setUser }}>
      <Router>
        <NavBar />
        <Container className="py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/posts/:postId" element={<PostView />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;







