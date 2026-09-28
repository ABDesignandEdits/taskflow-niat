/**
 * API Configuration
 *
 * Centralizes API URL configuration.
 * Uses environment variable with production Render backend fallback.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD 
    ? 'https://taskflow-niat.onrender.com/api' 
    : 'http://localhost:5001/api'
);

export default API_BASE_URL;