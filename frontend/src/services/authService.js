import api from './api';

const authService = {
  async login(identifier, password) {
    const { data } = await api.post('/auth/login', { identifier, password });
    return data;
  },
  async logout() {
    const { data } = await api.post('/auth/logout');
    return data;
  },
  async getProfile() {
    const { data } = await api.get('/auth/profile');
    return data;
  },
};

export default authService;
