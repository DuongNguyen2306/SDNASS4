import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchQuizzes } from '../store/slices/quizSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { quizzes, loading, error } = useSelector((state) => state.quiz);

  // Debug log
  console.log('Dashboard - Current user:', user);
  console.log('Dashboard - Is admin:', user?.admin);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  const handleStartQuiz = () => {
    navigate('/dashboard/quiz');
  };

  const handleManageQuestions = () => {
    navigate('/admin');
  };

  return (
    <Container className="quiz-container">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Dashboard</h1>
            <span className="welcome-text">Welcome, {user?.username}</span>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h3>Quiz</h3>
              <p>Test your knowledge with our quiz questions!</p>
              {loading ? (
                <p>Loading quizzes...</p>
              ) : quizzes.length > 0 ? (
                <div>
                  <p>Available quizzes: {quizzes.length}</p>
                  <Button 
                    variant="primary" 
                    onClick={handleStartQuiz}
                    size="lg"
                    className="me-3"
                  >
                    Start Quiz
                  </Button>
                  {user?.admin && (
                    <Button 
                      variant="outline-primary" 
                      onClick={handleManageQuestions}
                      size="lg"
                    >
                      Manage Questions
                    </Button>
                  )}
                </div>
              ) : (
                <div>
                  <p>No quizzes available at the moment.</p>
                  {user?.admin && (
                    <div>
                      <p>As an admin, you can create quizzes and questions.</p>
                      <Button 
                        variant="outline-primary" 
                        onClick={handleManageQuestions}
                        size="lg"
                        className="me-3"
                      >
                        Manage Questions
                      </Button>
                      <Button 
                        variant="outline-success" 
                        onClick={() => window.location.href = '/admin/quizzes'}
                        size="lg"
                      >
                        Manage Quizzes
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {user?.admin && (
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Body>
                <h4>Admin Panel</h4>
                <p>As an admin, you can manage questions and quizzes.</p>
                <Button 
                  variant="success" 
                  onClick={handleManageQuestions}
                  size="lg"
                >
                  Go to Admin Panel
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Dashboard;
