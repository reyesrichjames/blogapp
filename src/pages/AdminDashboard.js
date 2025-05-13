import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', imageUrl: '' });

  useEffect(() => {
    // Check if user state is loaded
    if (user.id === null) {
      // User might still be loading, check for token
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      // If there's a token but user state isn't set yet, wait for it
      const checkInterval = setInterval(() => {
        if (user.id !== null) {
          clearInterval(checkInterval);
          if (!user.isAdmin) {
            navigate('/posts');
          } else {
            fetchPosts();
          }
        }
      }, 100);
      
      // Clear interval after 3 seconds to prevent infinite checking
      setTimeout(() => clearInterval(checkInterval), 3000);
    } else {
      // User state is already loaded
      if (!user.isAdmin) {
        navigate('/posts');
        return;
      }
      
      fetchPosts();
    }
  }, [user, navigate]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://blogappapi-6wqv.onrender.com/posts/addPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setPosts([...posts, data]);
        setShowAddForm(false);
        setFormData({ title: '', content: '', imageUrl: '' });
      } else {
        setError(data.message || 'Failed to add post');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  const handleEditPost = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`https://blogappapi-6wqv.onrender.com/posts/updatePost/${currentPost._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          imageUrl: formData.imageUrl
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update the posts list
        setPosts(posts.map(post => 
          post._id === currentPost._id ? data : post
        ));
        setShowEditForm(false);
        setCurrentPost(null);
      } else {
        setError(data.message || 'Failed to update post');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`https://blogappapi-6wqv.onrender.com/posts/deletePost/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        // Remove the deleted post from the list
        setPosts(posts.filter(post => post._id !== postId));
      } else {
        setError(data.message || 'Failed to delete post');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  const openEditForm = (post) => {
    setCurrentPost(post);
    setFormData({ title: post.title, content: post.content, imageUrl: post.imageUrl });
    setShowEditForm(true);
    setShowAddForm(false);
  };

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            setShowAddForm(!showAddForm);
            setShowEditForm(false);
          }}
          id="addPost"
        >
          Add Post
        </button>
      </div>
      
      {showAddForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h3>Add New Post</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddPost}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="content" className="form-label">Content</label>
                <textarea 
                  className="form-control" 
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="imageUrl" className="form-label">Image URL</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Add Post</button>
            </form>
          </div>
        </div>
      )}
      
      {showEditForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h3>Update Post</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleEditPost}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="content" className="form-label">Content</label>
                <textarea 
                  className="form-control" 
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="imageUrl" className="form-label">Image URL</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Update Post</button>
            </form>
          </div>
        </div>
      )}
      
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>{post.author?.username || 'Unknown'}</td>
                <td>{new Date(post.createdAt).toLocaleString()}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => openEditForm(post)}
                  >
                    Update
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


