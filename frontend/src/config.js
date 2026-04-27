// Use environment variable for production, or local IP for multi-device testing
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.48:5002';
export default API_BASE_URL;
