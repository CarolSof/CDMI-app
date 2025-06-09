// app/constants/api.js o donde prefieras
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.132.114:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export default API;
