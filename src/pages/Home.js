import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import PreviewBlogPosts from '../components/PreviewBlogPosts'; // Import the new component

export default function Home() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://blogappapi-6wqv.onrender.com/posts/getPosts'); // Updated fetch link
        const data = await response.json();
        if (response.ok) {
          setBlogPosts(data);
        } else {
          setError(data.message || 'Failed to fetch blog posts');
        }
      } catch (err) {
        setError('Server error. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <div 
        style={{
          backgroundImage: `url('https://img.freepik.com/free-photo/makeup-brush-eyeglasses-cactus-plant-white-flower-bouquet-with-laptop-blue-background_23-2148178672.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '300px', // Increased height for the banner
          position: 'relative',
          color: 'white',
          display: 'flex',
          flexDirection: 'column', // Stack items vertically
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw', // Full viewport width
          marginLeft: 'calc((100% - 100vw) / 2)', // Center the header
          marginRight: 'calc((100% - 100vw) / 2)' // Center the header
        }}
      >
        <div 
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent dark gray
            padding: '20px',
            borderRadius: '5px',
            textAlign: 'center' // Center text
          }}
        >
          <h1 className="display-4">Welcome to the Blog App</h1>
          <p className="lead mb-3">Share your thoughts, read posts, and join the conversation!</p>
          <Link to="/posts">
            <Button variant="primary" size="lg">
              Browse Blog Posts
            </Button>
          </Link>
        </div>
      </div>
      <Container className="mt-3">
        <h2 className="text-center mb-5">Featured Blog Posts</h2>
        {loading ? (
          <Container className="text-center mt-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-2">Loading posts...</p>
          </Container>
        ) : error ? (
          <Container className="mt-5">
            <Alert variant="danger">{error}</Alert>
            <Button variant="primary" onClick={() => window.location.reload()}>Try Again</Button>
          </Container>
        ) : (
          <Row className="g-4">
            {blogPosts.map(post => (
              <PreviewBlogPosts 
                data={post} 
                key={post._id} 
              />
            ))}
          </Row>
        )}
      </Container>
    </>
  );
}

