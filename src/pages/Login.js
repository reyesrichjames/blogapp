import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import UserContext from '../UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const notyf = new Notyf({
    duration: 3000,
    position: { x: 'right', y: 'top' }
  });

  useEffect(() => {
    // Clear any previous errors when component mounts
    setError('');
  }, []);

  const loginUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://blogappapi-6wqv.onrender.com/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();
      console.log('Login response:', data); // Debug the response
      
      if (response.ok) {
        // Check for token in data.access instead of data.token
        if (data.access) {
          localStorage.setItem('token', data.access);
          console.log('Token stored:', data.access); // Debug token storage
          
          // Decode the JWT to get user info
          const tokenParts = data.access.split('.');
          if (tokenParts.length === 3) {
            try {
              const payload = JSON.parse(atob(tokenParts[1]));
              console.log('Decoded token payload:', payload);
              
              setUser({
                id: payload.id,
                isAdmin: payload.isAdmin,
                email: payload.email
              });
              
              notyf.success('Login successful!');
              
              if (payload.isAdmin) {
                navigate('/admin');
              } else {
                navigate('/');
              }
            } catch (e) {
              console.error('Error decoding token:', e);
              setError('Authentication error: Invalid token format');
              notyf.error('Authentication error: Please try again');
            }
          } else {
            setError('Authentication error: Invalid token format');
            notyf.error('Authentication error: Please try again');
          }
        } else {
          // Handle case where token is missing in response
          setError('Authentication error: Token missing in response');
          notyf.error('Authentication error: Please try again');
          console.error('Token missing in response:', data);
        }
      } else {
        setError(data.message || 'Login failed');
        notyf.error(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error. Please try again later.');
      notyf.error('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Card className="shadow" style={{ maxWidth: '500px', width: '100%' }}>
        <Card.Header className="bg-primary text-white">
          <h3 className="mb-0">Login</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={loginUser}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}




