import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions, createQuestion, updateQuestion, deleteQuestion } from '../store/slices/questionSlice';

const AdminDashboard = () => {
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
    keywords: ''
  });

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { questions, loading, error } = useSelector((state) => state.question);

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  // Debug: Log when questions change
  useEffect(() => {
    console.log('Questions updated:', questions);
  }, [questions]);

  // Removed problematic useEffect that was causing infinite loop


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
    const { name, value, type } = e.target;
    if (name.startsWith('option')) {
      const index = parseInt(name.split('_')[1]);
      const newOptions = [...formData.options];
      newOptions[index] = value;
      setFormData(prev => ({ ...prev, options: newOptions }));
    } else if (name === 'keywords') {
      // Convert comma-separated string to array
      const keywordsArray = value.split(',').map(k => k.trim()).filter(k => k.length > 0);
      setFormData(prev => ({
        ...prev,
        [name]: keywordsArray
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const questionData = {
      text: formData.text,
      options: formData.options.filter(option => option.trim() !== ''),
      correctAnswerIndex: formData.correctAnswerIndex,
      keywords: formData.keywords
    };

    console.log('Submit - editingQuestion:', editingQuestion); // Debug log
    console.log('Submit - questionData:', questionData); // Debug log

    try {
      if (editingQuestion) {
        console.log('Updating question with ID:', editingQuestion._id); // Debug log
        await dispatch(updateQuestion({ questionId: editingQuestion._id, questionData }));
      } else {
        console.log('Creating new question'); // Debug log
        await dispatch(createQuestion(questionData));
      }

      // Only reset form after successful operation
      setEditingQuestion(null);
      setFormData({ text: '', options: ['', '', '', ''], correctAnswerIndex: 0, keywords: '' });
      
      // Refetch questions to get updated data from server
      dispatch(fetchQuestions());
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  const handleEdit = (question) => {
    console.log('Edit clicked for question:', question); // Debug log
    setEditingQuestion(question);
    setFormData({
      text: question.text,
      options: [...question.options, '', ''].slice(0, 4), // Ensure 4 options
      correctAnswerIndex: question.correctAnswerIndex,
      keywords: Array.isArray(question.keywords) ? question.keywords.join(', ') : (question.keywords || '')
    });
  };

  const handleDelete = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await dispatch(deleteQuestion(questionId));
        // Refetch questions after successful delete
        dispatch(fetchQuestions());
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    }
  };


  // Use real data from database, filter out undefined items
  const displayQuestions = (questions || []).filter(question => question && question._id);
  
  // Debug log
  console.log('AdminDashboard - editingQuestion:', editingQuestion);
  console.log('AdminDashboard - questions:', questions);
  console.log('AdminDashboard - displayQuestions:', displayQuestions);
  console.log('AdminDashboard - loading:', loading);
  console.log('AdminDashboard - error:', error);

  return (
    <Container className="quiz-container">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Admin Dashboard</h1>
            <span className="welcome-text">Welcome, {user?.username}</span>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="admin-form">
            <Card.Body>
              <h3>Questions</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Question Text</Form.Label>
                  <Form.Control
                    type="text"
                    name="text"
                    value={formData.text}
                    onChange={handleInputChange}
                    placeholder="Enter question text"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Options</Form.Label>
                  {formData.options.map((option, index) => (
                    <Form.Control
                      key={index}
                      type="text"
                      name={`option_${index}`}
                      value={option}
                      onChange={handleInputChange}
                      placeholder={`Option ${index + 1}`}
                      className="mb-2"
                      required
                    />
                  ))}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Correct Answer Index:</Form.Label>
                  <Form.Control
                    type="number"
                    name="correctAnswerIndex"
                    value={formData.correctAnswerIndex}
                    onChange={handleInputChange}
                    min="0"
                    max="3"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Keywords (comma-separated):</Form.Label>
                  <Form.Control
                    type="text"
                    name="keywords"
                    value={Array.isArray(formData.keywords) ? formData.keywords.join(', ') : formData.keywords}
                    onChange={handleInputChange}
                    placeholder="Enter keywords separated by commas (e.g., science, physics, energy)"
                  />
                  <Form.Text className="text-muted">
                    Separate multiple keywords with commas
                  </Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit">
                  {editingQuestion ? 'Update Question' : 'Add Question'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <h4>Existing Questions</h4>
          {loading ? (
            <p>Loading questions...</p>
          ) : displayQuestions.length === 0 ? (
            <p>No questions available. Add some above!</p>
          ) : (
            <div>
              <p className="text-info">Debug: Found {displayQuestions.length} questions</p>
              {displayQuestions.map((question) => {
                console.log('Rendering question:', question);
                if (!question || !question._id) return null;
                
                return (
                  <Card key={question._id} className="question-item mb-3">
                    <Card.Body>
                      <h6>{question.text}</h6>
                      <ul>
                        {question.options && question.options.map((option, index) => (
                          <li key={index}>
                            {option} {index === question.correctAnswerIndex && '(Correct)'}
                          </li>
                        ))}
                      </ul>
                    {question.keywords && question.keywords.length > 0 && (
                      <div className="mt-2">
                        <strong>Keywords:</strong> 
                        <span className="ms-2">
                          {Array.isArray(question.keywords) 
                            ? question.keywords.join(', ') 
                            : question.keywords}
                        </span>
                      </div>
                    )}
                    <div>
                      <Button 
                        variant="warning" 
                        size="sm" 
                        onClick={() => handleEdit(question)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => handleDelete(question._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
                );
              })}
            </div>
          )}
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default AdminDashboard;
