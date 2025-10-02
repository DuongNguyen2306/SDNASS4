import api from './api';

const authService = {
  login: (username, password) => {
    console.log('Attempting login with:', { username, password });
    console.log('Login URL:', '/auth/login');
    return api.post('/auth/login', { username, password });
  },

  signup: (username, password, admin = false) => {
    console.log('Attempting signup with:', { username, password, admin });
    console.log('Signup URL:', '/auth/register');
    return api.post('/auth/register', { username, password, admin });
  },
};

export default authService;
