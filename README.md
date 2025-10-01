# Quiz Application - Frontend

This is a React frontend application for a full-stack quiz system built with Redux for state management.

## Features

- **Authentication**: Login and registration with JWT tokens
- **User Roles**: Regular users and admin users
- **Quiz System**: Take quizzes with multiple choice questions
- **Admin Panel**: CRUD operations for questions (admin only)
- **Responsive Design**: Built with Bootstrap 5

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on http://localhost:3000

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will open at http://localhost:3003

## Usage

### Regular Users
1. Register or login with your credentials
2. Navigate to Dashboard to see available quizzes
3. Click "Start Quiz" to begin taking quizzes
4. Answer questions and submit to see your score

### Admin Users
1. Login with admin credentials (set admin: true during registration)
2. Access Admin Dashboard to manage questions
3. Create, edit, or delete questions
4. Questions will be available for quizzes

## API Configuration

The frontend is configured to connect to the backend API at `http://localhost:3000/api`. 

To change the API URL, set the environment variable:
```bash
REACT_APP_API_URL=http://your-api-url/api
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.js       # Navigation component
│   └── ProtectedRoute.js # Route protection
├── pages/              # Page components
│   ├── Login.js        # Login/Register page
│   ├── Dashboard.js    # Main dashboard
│   ├── Quiz.js         # Quiz taking page
│   └── AdminDashboard.js # Admin management
├── store/              # Redux store
│   ├── store.js        # Store configuration
│   └── slices/         # Redux slices
│       ├── authSlice.js
│       ├── quizSlice.js
│       └── questionSlice.js
├── services/           # API services
│   ├── api.js          # Axios configuration
│   ├── authService.js  # Authentication API
│   ├── quizService.js  # Quiz API
│   └── questionService.js # Question API
└── utils/              # Utility functions
```

## Demo Data

The application includes demo data for testing purposes when the backend is not available. This includes sample questions and quiz functionality.

## Technologies Used

- React 18
- Redux Toolkit
- React Router DOM
- Axios
- Bootstrap 5
- React Bootstrap

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App