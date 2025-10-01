import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import quizService from '../../services/quizService';

// Async thunks
export const fetchQuizzes = createAsyncThunk(
  'quiz/fetchQuizzes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await quizService.getAllQuizzes();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quizzes');
    }
  }
);

export const fetchQuizById = createAsyncThunk(
  'quiz/fetchQuizById',
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await quizService.getQuizById(quizId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quiz');
    }
  }
);

export const fetchQuizWithQuestions = createAsyncThunk(
  'quiz/fetchQuizWithQuestions',
  async (quizId, { rejectWithValue }) => {
    try {
      console.log('fetchQuizWithQuestions - quizId:', quizId);
      const response = await quizService.getQuizWithQuestions(quizId);
      console.log('fetchQuizWithQuestions - response:', response);
      console.log('fetchQuizWithQuestions - response.data:', response.data);
      console.log('fetchQuizWithQuestions - response.data.data:', response.data.data);
      return response.data;
    } catch (error) {
      console.error('fetchQuizWithQuestions - error:', error);
      console.error('fetchQuizWithQuestions - error.response:', error.response);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quiz with questions');
    }
  }
);

export const createQuiz = createAsyncThunk(
  'quiz/createQuiz',
  async (quizData, { rejectWithValue }) => {
    try {
      const response = await quizService.createQuiz(quizData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create quiz');
    }
  }
);

export const updateQuiz = createAsyncThunk(
  'quiz/updateQuiz',
  async ({ quizId, quizData }, { rejectWithValue }) => {
    try {
      const response = await quizService.updateQuiz(quizId, quizData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update quiz');
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  'quiz/deleteQuiz',
  async (quizId, { rejectWithValue }) => {
    try {
      await quizService.deleteQuiz(quizId);
      return quizId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete quiz');
    }
  }
);

export const submitQuizAnswers = createAsyncThunk(
  'quiz/submitQuizAnswers',
  async ({ quizId, answers }, { rejectWithValue }) => {
    try {
      // This would be implemented based on your backend API
      // For now, we'll just calculate score locally
      return { quizId, answers, score: answers.filter(a => a.isCorrect).length };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit quiz');
    }
  }
);

const initialState = {
  quizzes: [],
  currentQuiz: null,
  currentQuizWithQuestions: null,
  quizResults: null,
  loading: false,
  error: null,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null;
      state.currentQuizWithQuestions = null;
      state.quizResults = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch quizzes
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
        state.error = null;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch quiz by ID
      .addCase(fetchQuizById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload;
        state.error = null;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch quiz with questions
      .addCase(fetchQuizWithQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizWithQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuizWithQuestions = action.payload;
        state.error = null;
      })
      .addCase(fetchQuizWithQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create quiz
      .addCase(createQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes.push(action.payload);
        state.error = null;
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update quiz
      .addCase(updateQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.quizzes.findIndex(q => q._id === action.payload._id);
        if (index !== -1) {
          state.quizzes[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete quiz
      .addCase(deleteQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = state.quizzes.filter(q => q._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit quiz answers
      .addCase(submitQuizAnswers.fulfilled, (state, action) => {
        state.quizResults = action.payload;
      });
  },
});

export const { clearCurrentQuiz, clearError } = quizSlice.actions;
export default quizSlice.reducer;
