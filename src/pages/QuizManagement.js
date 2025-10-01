import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizzes, createQuiz, updateQuiz, deleteQuiz } from '../store/slices/quizSlice';
import { fetchQuestions } from '../store/slices/questionSlice';

const QuizManagement = () => {
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    selectedQuestions: []
  });

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { quizzes, loading: quizLoading, error: quizError } = useSelector((state) => state.quiz);
  const { questions, loading: questionLoading } = useSelector((state) => state.question);

  useEffect(() => {
    dispatch(fetchQuizzes());
    dispatch(fetchQuestions());
  }, [dispatch]);

  // Check if user is admin
  if (!user?.admin) {
    return (
      <Container className="quiz-container">
        <Alert variant="danger">
          <h4>Access Denied</h4>
          <p>You need admin privileges to access this page.</p>
        </Alert>
      </Container>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionToggle = (questionId) => {
    setFormData(prev => ({
      ...prev,
      selectedQuestions: prev.selectedQuestions.includes(questionId)
        ? prev.selectedQuestions.filter(id => id !== questionId)
        : [...prev.selectedQuestions, questionId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quizData = {
      title: formData.title,
      description: formData.description,
      questions: formData.selectedQuestions
    };

    try {
      if (editingQuiz) {
        await dispatch(updateQuiz({ quizId: editingQuiz._id, quizData }));
      } else {
        await dispatch(createQuiz(quizData));
      }

      setEditingQuiz(null);
      setFormData({ title: '', description: '', selectedQuestions: [] });
      
      // Refetch quizzes to get updated data from server
      dispatch(fetchQuizzes());
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description || '',
      selectedQuestions: quiz.questions || []
    });
  };

  const handleDelete = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await dispatch(deleteQuiz(quizId));
        // Refetch quizzes after successful delete
        dispatch(fetchQuizzes());
      } catch (error) {
        console.error('Error deleting quiz:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditingQuiz(null);
    setFormData({ title: '', description: '', selectedQuestions: [] });
  };

  return (
    <Container className="quiz-container">
      <Row>
        <Col>
          <h1 className="mb-4">Quiz Management</h1>
          {quizError && <Alert variant="danger">{quizError}</Alert>}
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>{editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Quiz Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter quiz title"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter quiz description"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Select Questions</Form.Label>
                  {questionLoading ? (
                    <p>Loading questions...</p>
                  ) : (
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {questions.map((question) => (
                        <Form.Check
                          key={question._id}
                          type="checkbox"
                          id={`question-${question._id}`}
                          label={`${question.text} (${question.options.length} options)`}
                          checked={formData.selectedQuestions.includes(question._id)}
                          onChange={() => handleQuestionToggle(question._id)}
                          className="mb-2"
                        />
                      ))}
                    </div>
                  )}
                  <Form.Text className="text-muted">
                    Select questions to include in this quiz
                  </Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit" disabled={quizLoading}>
                  {quizLoading ? 'Saving...' : (editingQuiz ? 'Update Quiz' : 'Create Quiz')}
                </Button>
                {editingQuiz && (
                  <Button variant="secondary" onClick={handleCancel} className="ms-2">
                    Cancel
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <h3>Existing Quizzes</h3>
          {quizLoading ? (
            <p>Loading quizzes...</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Questions</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz) => (
                  <tr key={quiz._id}>
                    <td>{quiz.title}</td>
                    <td>{quiz.description || 'No description'}</td>
                    <td>
                      <Badge bg="info">{quiz.questions?.length || 0} questions</Badge>
                    </td>
                    <td>{new Date(quiz.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleEdit(quiz)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(quiz._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default QuizManagement;
