# ASS 2 Integration Guide

## API Endpoints cho ASS 2

### Base URL
```
http://localhost:3000
```

### 1. Thông tin API
- **GET** `/api/info` - Lấy thông tin API và danh sách endpoints
- **GET** `/health` - Health check

### 2. Quiz Management
- **GET** `/quizzes` - Lấy danh sách tất cả quiz
- **POST** `/quizzes` - Tạo quiz mới
- **GET** `/quizzes/:id` - Lấy quiz theo ID
- **PUT** `/quizzes/:id` - Cập nhật quiz
- **DELETE** `/quizzes/:id` - Xóa quiz và tất cả questions liên quan

### 3. Question Management
- **GET** `/questions` - Lấy danh sách tất cả questions
- **POST** `/questions` - Tạo question mới
- **GET** `/questions/:id` - Lấy question theo ID
- **PUT** `/questions/:id` - Cập nhật question
- **DELETE** `/questions/:id` - Xóa question và remove khỏi quiz

### 4. Quiz-Question Operations
- **POST** `/quizzes/:id/question` - Thêm 1 question vào quiz
- **POST** `/quizzes/:id/questions` - Thêm nhiều questions vào quiz
- **GET** `/quizzes/:id/populate` - Lấy quiz với questions chứa keyword "capital"

## Cách sử dụng trong ASS 2

### 1. JavaScript/Fetch API
```javascript
// Lấy danh sách quiz
fetch('http://localhost:3000/quizzes')
  .then(response => response.json())
  .then(data => console.log(data));

// Tạo quiz mới
fetch('http://localhost:3000/quizzes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'My Quiz',
    description: 'Quiz description',
    questions: [
      {
        text: 'What is the capital of France?',
        options: ['Paris', 'Lyon', 'Marseille'],
        keywords: ['capital', 'france'],
        correctAnswerIndex: 0
      }
    ]
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### 2. Axios (nếu sử dụng)
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Lấy danh sách quiz
const getQuizzes = () => api.get('/quizzes');

// Tạo quiz
const createQuiz = (quizData) => api.post('/quizzes', quizData);

// Tạo question
const createQuestion = (questionData) => api.post('/questions', questionData);
```

### 3. Sử dụng api-config.js
```javascript
const apiConfig = require('./api-config');

// Lấy tất cả quiz
apiConfig.examples.getAllQuizzes()
  .then(quizzes => console.log(quizzes));

// Tạo quiz mới
apiConfig.examples.createQuiz({
  title: 'Test Quiz',
  description: 'Test Description',
  questions: []
})
.then(result => console.log(result));
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

## CORS
API đã được cấu hình CORS để cho phép requests từ bất kỳ origin nào.

## Environment Variables
Tạo file `.env` trong thư mục `server/`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=SimpleQuiz
```

## Chạy Server
```bash
cd server
npm install
npm start
```

Server sẽ chạy tại `http://localhost:3000`
