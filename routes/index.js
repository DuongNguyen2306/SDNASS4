var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ 
    status: 'ok', 
    service: 'SimpleQuiz API',
    version: '1.0.0',
    endpoints: {
      quizzes: '/quizzes',
      questions: '/questions',
      users: '/users'
    }
  });
});

// API endpoint for ASS 2 integration
router.get('/api/info', function(req, res, next) {
  res.json({
    success: true,
    data: {
      service: 'SimpleQuiz API',
      version: '1.0.0',
      description: 'Quiz and Question Management API',
      baseUrl: req.protocol + '://' + req.get('host'),
      endpoints: {
        quizzes: {
          list: 'GET /quizzes',
          create: 'POST /quizzes',
          get: 'GET /quizzes/:id',
          update: 'PUT /quizzes/:id',
          delete: 'DELETE /quizzes/:id',
          addQuestion: 'POST /quizzes/:id/question',
          addQuestions: 'POST /quizzes/:id/questions',
          getWithCapital: 'GET /quizzes/:id/populate'
        },
        questions: {
          list: 'GET /questions',
          create: 'POST /questions',
          get: 'GET /questions/:id',
          update: 'PUT /questions/:id',
          delete: 'DELETE /questions/:id'
        }
      },
      cors: {
        enabled: true,
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        headers: ['Content-Type', 'Authorization']
      }
    }
  });
});

// Health check endpoint
router.get('/health', function(req, res, next) {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Debug endpoint for frontend testing
router.get('/debug/questions', function(req, res, next) {
  const Question = require('../models/Question');
  
  Question.find()
    .then(questions => {
      res.json({
        success: true,
        count: questions.length,
        data: questions,
        message: `Found ${questions.length} questions`
      });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        error: err.message
      });
    });
});

module.exports = router;
