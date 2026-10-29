import axios from 'axios';

// Use this one instance for all application requests. Project 1 answered them
// from a mock installed here; Express runs on its own port, so P2 needs an
// absolute base URL rather than the '/' that worked when nothing left the page.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

export default api;
