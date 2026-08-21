import api from './api';

const employeeService = {
  async list(params) {
    const { data } = await api.get('/employees', { params });
    return data;
  },
  async stats() {
    const { data } = await api.get('/employees/stats');
    return data;
  },
  async getById(id) {
    const { data } = await api.get(`/employees/${id}`);
    return data;
  },
  async create(payload) {
    const { data } = await api.post('/employees', payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/employees/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await api.delete(`/employees/${id}`);
    return data;
  },
};

export default employeeService;
