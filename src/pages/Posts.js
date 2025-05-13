import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Form, Alert, Modal } from 'react-bootstrap';
import UserContext from '../UserContext';
import placeholderImage from '../images/placeholder.jpg'; // Add your placeholder image path
import userPlaceholderImage from '../images/user-placeholder.jpg'; // Add your user placeholder image path
import PreviewBlogPosts from '../components/PreviewBlogPosts'; // Import the new component

export default function Posts() {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', imageUrl: '' });
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', content: '', imageUrl: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
    fetchPopularPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('https://blogappapi-6wqv.onrender.com/posts/getPosts');
      const data = await response.json();
      if (response.ok) {
        setPosts(data);
      } else {
        setError(data.message || 'Failed to fetch posts');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularPosts = async () => {
    try {
      const response = await fetch('https://blogappapi-6wqv.onrender.com/posts/getPopularPosts');
      const data = await response.json();
      if (response.ok) {
        setPopularPosts(data);
      } else {
        setError(data.message || 'Failed to fetch popular posts');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://blogappapi-6wqv.onrender.com/posts/addPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, username: user.username })
      });
      const data = await response.json();
      if (response.ok) {
        setPosts([...posts, { ...data, author: { _id: user.id, username: user.username } }]);
        setShowAddForm(false);
        setFormData({ title: '', content: '', imageUrl: '' });
      } else {
        setAddError(data.message || 'Failed to add post');
      }
    } catch (err) {
      setAddError('Server error. Please try again later.');
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditClick = (post) => {
    setEditPostId(post._id);
    setEditFormData({ 
      title: post.title, 
      content: post.content, 
      imageUrl: post.imageUrl || ''
    });
    setEditError('');
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://blogappapi-6wqv.onrender.com/posts/updatePost/${editPostId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });
      const data = await response.json();
      if (response.ok) {
        setPosts(posts.map(post => post._id === editPostId ? data : post));
        setShowEditModal(false);
        setEditPostId(null);
      } else {
        setEditError(data.message || 'Failed to update post');
      }
    } catch (err) {
      setEditError('Server error. Please try again later.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://blogappapi-6wqv.onrender.com/posts/deletePost/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setPosts(posts.filter(post => post._id !== postId));
      } else {
        alert('Failed to delete post');
      }
    } catch (err) {
      alert('Server error. Please try again later.');
    }
  };

  // Filter posts based on search term
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading posts...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger">{error}</div>
        <Button variant="primary" onClick={fetchPosts}>Try Again</Button>
      </Container>
    );
  }

  return (
    <>
      <div 
        style={{
          backgroundImage: `url('https://st2.depositphotos.com/4107269/7705/i/450/depositphotos_77053627-stock-photo-journalist-working-on-his-new.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '200px', // Adjust height as needed
          position: 'relative',
          color: 'white',
          display: 'flex',
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
          <h1 className="display-4">Blog Posts</h1>
          {user.id && ( // Add Post button for logged-in users
            <Button onClick={() => setShowAddForm(true)} variant="success" className="mt-3">
              Add Post
            </Button>
          )}
        </div>
      </div>
      <Container className="mt-5">
        <Row>
          <Col md={4}> {/* Search input on the left side */}
            <Form className="mb-4 pt-3">
              <Form.Control
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form>
            {/* Popular Posts Section */}
            <h3>Popular Posts</h3>
            {popularPosts.length === 0 ? (
              <p>No popular posts found.</p>
            ) : (
              popularPosts.map(post => (
                <Row key={post._id} className="mb-3">
                  <Col xs={4}>
                    <img 
                      src={post.imageUrl || placeholderImage} 
                      alt={post.title} 
                      style={{ width: '100%', borderRadius: '0.5rem' }} // Smaller image
                    />
                  </Col>
                  <Col xs={8}>
                    <h5>
                      <Link to={`/posts/${post._id}`} style={{ color: '#0d6efd', textDecoration: 'underline' }}>
                        {post.title}
                      </Link>
                    </h5>
                    <p className="text-muted">{new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                    <p className="text-muted">{post.commentCount} comments</p>
                  </Col>
                </Row>
              ))
            )}
          </Col>
          <Col md={8}> {/* Blog posts on the right side */}
            {filteredPosts.length === 0 ? (
              <div className="text-center my-5">
                <h3>No posts found</h3>
              </div>
            ) : (
              filteredPosts.map(post => (
                <Row key={post._id} className="mb-4"> {/* One card per row */}
                  <Col xs={12}>
                    <Card className="h-100 shadow-sm" style={{ border: 'none', borderRadius: '0.5rem' }}>
                      <Row className="g-0">
                        <Col md={4}>
                          <Card.Img 
                            variant="top" 
                            src={post.imageUrl || placeholderImage}
                            alt="Post Image" 
                            style={{ 
                              borderBottomLeftRadius: '0.5rem', 
                              borderBottomRightRadius: '0.5rem', 
                              width: '100%', 
                              padding: '1rem' // Adjust padding as needed
                            }}
                          />
                        </Col>
                        <Col md={8}>
                          <Card.Body>
                            <Card.Title>{post.title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              <img src={userPlaceholderImage} alt="Profile" style={{ width: '20px', marginRight: '5px' }} />
                              By {post.author?.username || 'Unknown'}
                            </Card.Subtitle>
                            <Card.Text className="text-secondary">
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Card.Text>
                            <Card.Text className="text-secondary post-description">
                              {post.content}
                            </Card.Text>
                            <div className="d-flex justify-content-start align-items-center">
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                as={Link}
                                to={`/posts/${post._id}`}
                                className="me-2"
                              >
                                READ MORE
                              </Button>
                              {user.id && post.author && user.id === post.author._id && (
                                <>
                                  <Button variant="warning" size="sm" onClick={() => handleEditClick(post)}>Edit</Button>
                                  <Button variant="danger" size="sm" onClick={() => handleDeletePost(post._id)} className="ms-2">Delete</Button>
                                </>
                              )}
                            </div>
                          </Card.Body>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
              ))
            )}
          </Col>
        </Row>
      </Container>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editFormData.title}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                value={editFormData.content}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                name="imageUrl"
                value={editFormData.imageUrl}
                onChange={handleEditInputChange}
                required={false}
              />
            </Form.Group>
            {editError && <Alert variant="danger">{editError}</Alert>}
            <Button type="submit" variant="primary" disabled={editLoading}>
              {editLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showAddForm} onHide={() => setShowAddForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddPost}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
              />
            </Form.Group>
            {addError && <Alert variant="danger">{addError}</Alert>}
            <Button type="submit" variant="primary" disabled={addLoading}>
              {addLoading ? 'Adding...' : 'Add Post'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}