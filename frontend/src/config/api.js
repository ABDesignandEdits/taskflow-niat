/**
 * API Configuration
 *
 * Centralizes API base URL configuration.
 * Normalizes user-supplied or default URLs with /api.
 */

let rawUrl = import.meta.env.VITE_API_URL || 'https://taskflow-niat.onrender.com/api';

// Clean whitespace and trailing slashes
rawUrl = rawUrl.trim().replace(/\/+$/, '');

// If URL does not end with /api, append /api
const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

export default API_BASE_URL;