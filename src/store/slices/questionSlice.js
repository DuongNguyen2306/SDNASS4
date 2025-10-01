import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import questionService from '../../services/questionService';

// Async thunks
export const fetchQuestions = createAsyncThunk(
  'question/fetchQuestions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await questionService.getAllQuestions();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch questions');
    }
  }
);

export const createQuestion = createAsyncThunk(
  'question/createQuestion',
  async (questionData, { rejectWithValue }) => {
    try {
      const response = await questionService.createQuestion(questionData);
      console.log('Create question response:', response.data); // Debug log
      return response.data.data;
    } catch (error) {
      console.error('Create question error:', error); // Debug log
      return rejectWithValue(error.response?.data?.message || 'Failed to create question');
    }
  }
);

export const updateQuestion = createAsyncThunk(
  'question/updateQuestion',
  async ({ questionId, questionData }, { rejectWithValue }) => {
    try {
      const response = await questionService.updateQuestion(questionId, questionData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update question');
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  'question/deleteQuestion',
  async (questionId, { rejectWithValue }) => {
    try {
      await questionService.deleteQuestion(questionId);
      return questionId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete question');
    }
  }
);

const initialState = {
  questions: [],
  loading: false,
  error: null,
};

const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch questions
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        
        // Debug log
        console.log('fetchQuestions.fulfilled - action.payload:', action.payload);
        
        state.questions = Array.isArray(action.payload) 
          ? action.payload.filter(q => {
              try {
                return q && q._id;
              } catch (error) {
                console.error('Error in fetchQuestions filter:', error, 'q:', q);
                return false;
              }
            })
          : [];
          
        console.log('fetchQuestions.fulfilled - filtered questions:', state.questions);
        state.error = null;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create question
      .addCase(createQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.loading = false;
        
        // Debug log
        console.log('createQuestion.fulfilled - action.payload:', action.payload);
        console.log('createQuestion.fulfilled - state.questions before:', state.questions);
        
        // Ensure state.questions is a valid array
        if (!Array.isArray(state.questions)) {
          state.questions = [];
        }
        
        if (action.payload && action.payload._id) {
          state.questions.push(action.payload);
        }
        
        console.log('createQuestion.fulfilled - state.questions after:', state.questions);
        state.error = null;
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update question
      .addCase(updateQuestion.fulfilled, (state, action) => {
        // Ensure state.questions is a valid array
        if (!Array.isArray(state.questions)) {
          state.questions = [];
          return;
        }
        
        // Debug log
        console.log('updateQuestion.fulfilled - state.questions:', state.questions);
        console.log('updateQuestion.fulfilled - action.payload:', action.payload);
        
        // Filter out any undefined/null items first
        state.questions = state.questions.filter(q => {
          try {
            return q && q._id;
          } catch (error) {
            console.error('Error in updateQuestion filter:', error, 'q:', q);
            return false;
          }
        });
        
        const index = state.questions.findIndex(q => {
          try {
            return q && q._id && action.payload && action.payload._id && q._id === action.payload._id;
          } catch (error) {
            console.error('Error in findIndex callback:', error, 'q:', q, 'action.payload:', action.payload);
            return false;
          }
        });
        if (index !== -1) {
          state.questions[index] = action.payload;
        }
      })
      // Delete question
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        // Ensure state.questions is a valid array
        if (!Array.isArray(state.questions)) {
          state.questions = [];
        }
        
        state.questions = state.questions.filter(q => {
          try {
            return q && q._id && action.payload && q._id !== action.payload;
          } catch (error) {
            console.error('Error in filter callback:', error, 'q:', q, 'action.payload:', action.payload);
            return false;
          }
        });
      });
  },
});

export const { clearError } = questionSlice.actions;
export default questionSlice.reducer;
