// frontend/src/services/apij.js
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apij = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'ngrok-skip-browser-warning': 'true',
    },
    
});

export default apij;