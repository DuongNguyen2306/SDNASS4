import api from './api';

const quizService = {
  getAllQuizzes: () => {
    return api.get('/quizzes');
  },

  getQuizById: (quizId) => {
    return api.get(`/quizzes/${quizId}`);
  },

  getQuizWithQuestions: (quizId) => {
    return api.get(`/quizzes/${quizId}`);
  },

  createQuiz: (quizData) => {
    return api.post('/quizzes', quizData);
  },

  updateQuiz: (quizId, quizData) => {
    return api.put(`/quizzes/${quizId}`, quizData);
  },

  deleteQuiz: (quizId) => {
    return api.delete(`/quizzes/${quizId}`);
  },

  addQuestionToQuiz: (quizId, questionId) => {
    return api.post(`/quizzes/${quizId}/question`, { questionId });
  },

  addQuestionsToQuiz: (quizId, questionIds) => {
    return api.post(`/quizzes/${quizId}/questions`, { questionIds });
  },
};

export default quizService;
