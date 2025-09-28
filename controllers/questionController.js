const mongoose = require('mongoose');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

async function getAllQuestions(req, res) {
	try {
		const questions = await Question.find();
		return res.json({ success: true, data: questions });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ success: false, message: err.message || 'Server error' });
	}
}

async function createQuestion(req, res, next) {
	try {
		const { text, options, keywords, correctAnswerIndex } = req.body;
		if (!text || !Array.isArray(options) || typeof correctAnswerIndex !== 'number') {
			return res.status(400).json({ message: 'Invalid question payload' });
		}
		const question = await Question.create({ text, options, keywords, correctAnswerIndex });
		res.status(201).json(question);
	} catch (err) {
		next(err);
	}
}

async function getQuestionById(req, res, next) {
	try {
		const { questionId } = req.params;
		if (!mongoose.Types.ObjectId.isValid(questionId)) return res.status(400).json({ message: 'Invalid questionId' });
		const question = await Question.findById(questionId);
		if (!question) return res.status(404).json({ message: 'Question not found' });
		res.json(question);
	} catch (err) {
		next(err);
	}
}

async function updateQuestion(req, res, next) {
	try {
		const { questionId } = req.params;
		if (!mongoose.Types.ObjectId.isValid(questionId)) return res.status(400).json({ message: 'Invalid questionId' });
		const { text, options, keywords, correctAnswerIndex } = req.body;
		const update = {};
		if (typeof text !== 'undefined') update.text = text;
		if (typeof options !== 'undefined') update.options = options;
		if (typeof keywords !== 'undefined') update.keywords = keywords;
		if (typeof correctAnswerIndex !== 'undefined') update.correctAnswerIndex = correctAnswerIndex;
		const question = await Question.findByIdAndUpdate(questionId, update, { new: true, runValidators: true });
		if (!question) return res.status(404).json({ message: 'Question not found' });
		res.json(question);
	} catch (err) {
		next(err);
	}
}

async function deleteQuestion(req, res) {
	try {
		const { questionId } = req.params;

		const deleted = await Question.findByIdAndDelete(questionId);
		if (!deleted) return res.status(404).json({ success: false, message: 'Question not found' });

		// remove references from quizzes
		await Quiz.updateMany(
			{ questions: questionId },
			{ $pull: { questions: questionId } }
		);

		return res.json({ success: true, data: { id: questionId } });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ success: false, message: err.message || 'Server error' });
	}
}

module.exports = {
	getAllQuestions,
	createQuestion,
	getQuestionById,
	updateQuestion,
	deleteQuestion,
};
