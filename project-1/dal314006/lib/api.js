import axios from 'axios';
import { installMock } from './mockSetup.js';

// Use this one instance for all application requests.
const api = axios.create({ baseURL: '/' });

// Project 1: intercept requests locally; remove this call (and import) in P2.
installMock(api);

export default api;
