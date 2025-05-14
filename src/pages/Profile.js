import { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col, Modal } from 'react-bootstrap';
import UserContext from '../UserContext';

export default function Profile() {
    const { user } = useContext(UserContext);
    const [formData, setFormData] = useState({ username: '', email: '', profilePic: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('https://blogappapi-6wqv.onrender.com/users/details', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setFormData({
                        username: data.user.username,
                        email: data.user.email,
                        profilePic: data.user.profilePic
                    });
                } else {
                    setError(data.message || 'Failed to fetch profile');
                }
            } catch (err) {
                setError('Server error. Please try again later.');
            }
        };

        if (user.id) {
            fetchProfile();
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://blogappapi-6wqv.onrender.com/users/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess('Profile updated successfully!');
            } else {
                setError(data.message || 'Failed to update profile');
            }
        } catch (err) {
            setError('Server error. Please try again later.');
        }
    };

    const handleResetPassword = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setNewPassword('');
        setConfirmPassword('');
    };

    const handlePasswordReset = async () => {
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://blogappapi-6wqv.onrender.com/users/update-password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ newPassword })
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess('Password reset successfully!');
                handleModalClose();
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError('Server error. Please try again later.');
        }
    };

    return (
        <Container>
            <h1 className="text-center my-5">Edit Profile</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Card className="text-center" style={{ width: '100%', maxWidth: '500px', margin: 'auto' }}>
                <Card.Img className="mx-auto"
                    variant="top" 
                    src={formData.profilePic || 'path/to/default/profile/pic.jpg'} 
                    alt="Profile Picture" 
                    style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3 text-start">
                            <Col>
                                <Form.Group controlId="formUsername">
                                    <Form.Label><strong>Username</strong></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3 text-start">
                            <Col>
                                <Form.Group controlId="formEmail">
                                    <Form.Label><strong>Email</strong></Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3 text-start">
                            <Col>
                                <Form.Group controlId="formProfilePic">
                                    <Form.Label><strong>Profile Picture URL</strong></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="profilePic"
                                        value={formData.profilePic}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <Button variant="secondary" onClick={handleResetPassword} className="w-100">Reset Password</Button>
                            </Col>
                            <Col>
                                <Button variant="primary" type="submit" className="w-100">Update Profile</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="newPassword">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handlePasswordReset}>
                        Reset Password
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
