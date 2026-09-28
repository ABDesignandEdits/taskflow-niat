import app from './app.js';
import { config } from './config/env.js';

const PORT = config.port || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║       🚀 TaskFlow Backend Server is Live       ║
╠════════════════════════════════════════════════╣
║  📡 Port:        ${PORT}                          ║
║  🌐 URL:         http://localhost:${PORT}         ║
║  🧪 Health:      http://localhost:${PORT}/health   ║
║  🔒 Environment: ${config.nodeEnv || 'development'}               ║
╚════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export default server;
