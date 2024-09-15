import axios from 'axios';
import CONFIG from '../config/axiosConfig.js';

const api = axios.create(CONFIG);

export default api;
