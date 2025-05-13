import { Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function PreviewBlogPosts(props) {
  const { data } = props;
  const { _id, title, content, createdAt, imageUrl } = data;

  return (
    <Col xs={12} md={6} lg={4}>
      <Card className="h-100 d-flex flex-column mx-3 shadow" style={{ 
        border: 'none',
        minHeight: '350px',
        borderRadius: '0.5rem'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          margin: '10px 0',
          width: '100%',
          height: '200px'
        }}>
          <img 
            src={imageUrl || "https://via.placeholder.com/150"}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              backgroundColor: 'white'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/150";
            }}
          />
        </div>
        <Card.Body className="flex-grow-1">
          <Card.Title style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
            {title}
          </Card.Title>
          <Card.Text style={{ 
            maxHeight: '4.5em',
            overflow: 'hidden',
            fontSize: '0.9rem',
            color: '#6c757d',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 4
          }}>
            {content}...
          </Card.Text>
        </Card.Body>
        <Card.Footer 
          className="bg-light border-top text-start"
          style={{ borderRadius: '0 0 0.5rem 0.5rem' }}
        >
          <Link 
            className="btn btn-outline-primary"
            to={`/posts/${_id}`}
            style={{
              width: 'auto',
              borderRadius: '0.5rem',
              display: 'inline-block'
            }}
          >
            Read More
          </Link>
        </Card.Footer>
      </Card>
    </Col>
  );
}
