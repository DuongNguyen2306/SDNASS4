import api from './api';

const questionService = {
  getAllQuestions: () => {
    return api.get('/questions');
  },

  getQuestionById: (questionId) => {
    return api.get(`/questions/${questionId}`);
  },

  createQuestion: (questionData) => {
    return api.post('/questions', questionData);
  },

  updateQuestion: (questionId, questionData) => {
    return api.put(`/questions/${questionId}`, questionData);
  },

  deleteQuestion: (questionId) => {
    return api.delete(`/questions/${questionId}`);
  },
};

export default questionService;
