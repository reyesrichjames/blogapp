import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Spinner, Form, ListGroup } from 'react-bootstrap';
import UserContext from '../UserContext';

export default function PostView() {
  const { postId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
    // eslint-disable-next-line
  }, [postId]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://blogappapi-6wqv.onrender.com/posts/getPost/${postId}`);
      const data = await response.json();
      if (response.ok) {
        setPost(data);
      } else {
        setError(data.message || 'Failed to fetch post details');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`https://blogappapi-6wqv.onrender.com/posts/getComments/${postId}`);
      const data = await response.json();
      if (response.ok) {
        setComments(data);
      }
    } catch (err) {
      // ignore
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmittingComment(true);
    const token = localStorage.getItem('token');
    let body = { content: comment, author: 'Anonymous' };
    let headers = { 'Content-Type': 'application/json' };
    if (user.id) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    try {
      const endpoint = user.id
        ? `https://blogappapi-6wqv.onrender.com/posts/addComment/${postId}`
        : `https://blogappapi-6wqv.onrender.com/posts/addGuestComment/${postId}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      if (response.ok) {
        fetchComments();
        setComment('');
      } else {
        alert('Failed to add comment');
      }
    } catch (err) {
      alert('Server error. Please try again later.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://blogappapi-6wqv.onrender.com/posts/deleteComment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setComments(comments.filter(comment => comment._id !== commentId));
      } else {
        alert('Failed to delete comment');
      }
    } catch (err) {
      alert('Server error. Please try again later.');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading post details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger">{error}</div>
        <Button variant="primary" onClick={fetchPost}>Try Again</Button>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container className="mt-5 text-center">
        <h2>Post not found</h2>
        <Link to="/posts" className="btn btn-primary mt-3">
          Back to Posts
        </Link>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="shadow mb-4" style={{ border: 'none' }}>
            <div className="text-center">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                style={{ width: '100%', borderRadius: '0.5rem' }} 
              />
            </div>
            <Card.Body>
              <h2 className="mb-0">{post.title}</h2>
              <span className="text-muted">
                <img 
                  src={post.author?.profilePic || 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'}
                  alt="Profile" 
                  style={{ width: '20px', marginRight: '5px', borderRadius: '50%' }} 
                />
                By {post.author?.username || 'Unknown'}
              </span>
              <p className="text-muted">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="mt-3">{post.content}</p>
              <div className="d-flex justify-content-between">
                <Link to="/posts" className="btn btn-outline-primary">
                  Back to Posts
                </Link>
              </div>
            </Card.Body>
          </Card>

          {/* Comments Section */}
          <Card className="shadow">
            <Card.Header className="bg-light">
              <h3 className="mb-0">Comments</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleCommentSubmit} className="mb-4">
                <Form.Group className="mb-3">
                  <Form.Label>Add a comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this post..."
                    required
                  />
                </Form.Group>
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={submittingComment}
                >
                  {submittingComment ? 'Submitting...' : 'Post Comment'}
                </Button>
              </Form>
              <hr />
              {comments.length > 0 ? (
                <ListGroup variant="flush">
                  {comments.map((comment, index) => (
                    <ListGroup.Item key={index} className="border-bottom py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{comment.author}</strong>
                          <small className="text-muted ms-2">
                            {new Date(comment.createdAt).toLocaleString()}
                          </small>
                        </div>
                        {user.isAdmin && (
                          <Button variant="danger" size="sm" onClick={() => handleDeleteComment(comment._id)}>
                            Delete
                          </Button>
                        )}
                      </div>
                      <p className="mt-2 mb-0">{comment.content}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-center text-muted">No comments yet. Be the first to comment!</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
} 