import axios from 'axios';

const token = localStorage.getItem('token');

if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5054';

export default axios;