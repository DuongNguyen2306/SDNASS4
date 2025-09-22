const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.get('/', quizController.getAllQuizzes);
router.post('/', quizController.createQuiz);
router.get('/:quizId', quizController.getQuizById);
router.put('/:quizId', quizController.updateQuiz);
router.delete('/:quizId', quizController.deleteQuiz);
router.get('/:quizId/populate', quizController.getQuizWithCapitalQuestions);
router.post('/:quizId/question', quizController.addSingleQuestionToQuiz);
router.post('/:quizId/questions', quizController.addMultipleQuestionsToQuiz);

module.exports = router;
