import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

const NavbarComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand>
          <div className="d-flex align-items-center">
            <div className="me-2">
              <strong>Quiz App</strong>
            </div>
          </div>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => handleNavClick('/dashboard')}>
              Home
            </Nav.Link>
            <Nav.Link onClick={() => handleNavClick('/dashboard/quiz')}>
              Quiz
            </Nav.Link>
            <Nav.Link onClick={() => handleNavClick('/dashboard')}>
              Article
            </Nav.Link>
                {user?.admin && (
                  <>
                    <Nav.Link onClick={() => handleNavClick('/admin')}>
                      Manage Questions
                    </Nav.Link>
                    <Nav.Link onClick={() => handleNavClick('/admin/quizzes')}>
                      Manage Quizzes
                    </Nav.Link>
                  </>
                )}
          </Nav>
          <Nav>
            <Navbar.Text className="welcome-text me-3">
              Welcome, {user?.username}
            </Navbar.Text>
            <Nav.Link onClick={handleLogout}>
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
