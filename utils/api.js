import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.122.114:8000/api', // Cambia TU_IP_LOCAL por tu IP real, ejemplo: 192.168.1.100
  withCredentials: true,
});

export default api;
