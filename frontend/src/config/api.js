/**
 * API Configuration
 *
 * Centralizes API base URL configuration.
 * Default points to the live deployed Render backend service.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://taskflow-niat.onrender.com/api';

export default API_BASE_URL;