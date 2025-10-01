import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchQuizzes, fetchQuizWithQuestions, submitQuizAnswers, clearCurrentQuiz } from '../store/slices/quizSlice';

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { quizzes, currentQuizWithQuestions, loading, error } = useSelector((state) => state.quiz);

  useEffect(() => {
    // Load quizzes first
    dispatch(fetchQuizzes());
    
    return () => {
      dispatch(clearCurrentQuiz());
    };
  }, [dispatch]);

  // No auto-load quiz, let user select

  const handleStartQuiz = async (quizId) => {
    console.log('Starting quiz with ID:', quizId);
    try {
      await dispatch(fetchQuizWithQuestions(quizId));
      console.log('Quiz loaded successfully');
    } catch (error) {
      console.error('Error loading quiz:', error);
    }
  };

  // Use real data from database
  const questions = currentQuizWithQuestions?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = () => {
    const answers = questions.map((question, index) => ({
      questionId: question._id,
      selectedAnswer: selectedAnswers[index],
      correctAnswer: question.correctAnswerIndex,
      isCorrect: selectedAnswers[index] === question.correctAnswerIndex
    }));

    const calculatedScore = answers.filter(a => a.isCorrect).length;
    setScore(calculatedScore);
    setQuizCompleted(true);

    // Dispatch to store
    dispatch(submitQuizAnswers({ quizId: 'demo-quiz-id', answers }));
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setScore(0);
  };

  if (loading) {
    return (
      <Container className="quiz-container">
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading quiz...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="quiz-container">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  // Show message if no quiz available
  if (!quizzes || quizzes.length === 0) {
    return (
      <Container className="quiz-container">
        <Row>
          <Col>
            <Card className="text-center">
              <Card.Body>
                <h2>No Quiz Available</h2>
                <p>There are no quizzes available at the moment.</p>
                <p>Please contact an administrator to create quizzes.</p>
                <Button 
                  variant="primary" 
                  onClick={() => window.history.back()}
                >
                  Go Back
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  // Show quiz selection if no quiz is selected
  if (!currentQuizWithQuestions) {
    return (
      <Container className="quiz-container">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Select a Quiz</h1>
              <span className="welcome-text">Welcome, {user?.username}</span>
            </div>
          </Col>
        </Row>

        <Row>
          {quizzes.map((quiz) => (
            <Col md={6} lg={4} key={quiz._id} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{quiz.title}</Card.Title>
                  <Card.Text>{quiz.description || 'No description available'}</Card.Text>
                  <Card.Text className="text-muted">
                    {quiz.questions?.length || 0} questions
                  </Card.Text>
                  <Button 
                    variant="primary" 
                    onClick={() => handleStartQuiz(quiz._id)}
                    className="w-100"
                  >
                    Start Quiz
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }

  // Show loading when quiz is being loaded
  if (!questions || questions.length === 0) {
    return (
      <Container className="quiz-container">
        <Row>
          <Col>
            <Card className="text-center">
              <Card.Body>
                <h2>Loading Quiz...</h2>
                <p>Please wait while we load the quiz questions.</p>
                <Spinner animation="border" />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (quizCompleted) {
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

        <Row>
          <Col>
            <Card className="text-center">
              <Card.Body>
                <h2>Quiz Completed</h2>
                <h3>Your score: {score}</h3>
                <Button 
                  variant="primary" 
                  onClick={handleRestartQuiz}
                  size="lg"
                >
                  Restart Quiz
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="quiz-container">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1>{currentQuizWithQuestions?.title || 'Quiz'}</h1>
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => dispatch(clearCurrentQuiz())}
              >
                ← Back to Quiz Selection
              </Button>
            </div>
            <span className="welcome-text">Welcome, {user?.username}</span>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="question-card">
            <Card.Body>
              <h3>Quiz</h3>
              <h5 className="mb-4">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h5>
              
              <h6 className="mb-4">{currentQuestion?.text}</h6>
              
              <div className="mb-4">
                {currentQuestion?.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswers[currentQuestionIndex] === index ? "primary" : "outline-primary"}
                    className={`option-button ${selectedAnswers[currentQuestionIndex] === index ? 'selected' : ''}`}
                    onClick={() => handleAnswerSelect(index)}
                    block
                  >
                    {option}
                  </Button>
                ))}
              </div>

              <Button 
                variant="primary" 
                onClick={handleNextQuestion}
                disabled={selectedAnswers[currentQuestionIndex] === undefined}
                size="lg"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Submit Answer'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Quiz;
