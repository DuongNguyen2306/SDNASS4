import api from './api';

const authService = {
  login: (username, password) => {
    return api.post('/auth/login', { username, password });
  },

  signup: (username, password, admin = false) => {
    return api.post('/auth/register', { username, password, admin });
  },
};

export default authService;
