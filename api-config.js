// API Configuration for ASS 2 Integration
module.exports = {
  // Base URL - change this to your server URL
  baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  
  // API Endpoints
  endpoints: {
    // Quiz endpoints
    quizzes: {
      list: '/quizzes',
      create: '/quizzes',
      get: (id) => `/quizzes/${id}`,
      update: (id) => `/quizzes/${id}`,
      delete: (id) => `/quizzes/${id}`,
      addQuestion: (id) => `/quizzes/${id}/question`,
      addQuestions: (id) => `/quizzes/${id}/questions`,
      getWithCapital: (id) => `/quizzes/${id}/populate`
    },
    
    // Question endpoints
    questions: {
      list: '/questions',
      create: '/questions',
      get: (id) => `/questions/${id}`,
      update: (id) => `/questions/${id}`,
      delete: (id) => `/questions/${id}`
    },
    
    // Utility endpoints
    info: '/api/info',
    health: '/health'
  },
  
  // Request configuration
  requestConfig: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: 10000 // 10 seconds
  },
  
  // Example usage functions
  getFullUrl: function(endpoint) {
    return this.baseUrl + endpoint;
  },
  
  // Example API calls
  examples: {
    // Get all quizzes
    getAllQuizzes: function() {
      return fetch(this.getFullUrl(this.endpoints.quizzes.list))
        .then(res => res.json());
    },
    
    // Create a quiz
    createQuiz: function(quizData) {
      return fetch(this.getFullUrl(this.endpoints.quizzes.create), {
        method: 'POST',
        headers: this.requestConfig.headers,
        body: JSON.stringify(quizData)
      }).then(res => res.json());
    },
    
    // Get quiz by ID
    getQuiz: function(quizId) {
      return fetch(this.getFullUrl(this.endpoints.quizzes.get(quizId)))
        .then(res => res.json());
    },
    
    // Create a question
    createQuestion: function(questionData) {
      return fetch(this.getFullUrl(this.endpoints.questions.create), {
        method: 'POST',
        headers: this.requestConfig.headers,
        body: JSON.stringify(questionData)
      }).then(res => res.json());
    },
    
    // Add question to quiz
    addQuestionToQuiz: function(quizId, questionData) {
      return fetch(this.getFullUrl(this.endpoints.quizzes.addQuestion(quizId)), {
        method: 'POST',
        headers: this.requestConfig.headers,
        body: JSON.stringify(questionData)
      }).then(res => res.json());
    }
  }
};
