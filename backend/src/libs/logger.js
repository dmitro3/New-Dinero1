import config from '@src/configs/app.config';
import pino from 'pino';

// Determine the environment
const isProduction = config.get('env') === 'production';

// Transport options
const transport = !isProduction
  ? {
    target: 'pino-pretty', // Human-readable logs for development
    options: {
      colorize: true, // Colorize logs for better readability in the terminal
      translateTime: true, // Add human-readable timestamps
      ignore: 'pid,hostname', // Exclude process ID and hostname for simplicity
    }
  }
  : undefined; // No transport for production to ensure logs are JSON-formatted

// Create the logger instance
export const Logger = pino(
  {
    level: config.get('log_level') || 'info', // Default log level
    base: {
      pid: process.pid, // Include process ID in logs
      app: config.get('app.name') || 'my-app', // Include application name
    },
    timestamp: pino.stdTimeFunctions.isoTime, // Use ISO timestamps
    transport, // Add transport options for non-production environments
  },
  pino.destination(1) // Log to a file or stdout
);

// Log uncaught exceptions
process.on('uncaughtException', (err) => {
  Logger.fatal({ err }, 'Uncaught Exception');
  process.exit(1); // Exit process after logging
});

// Log unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  Logger.error({ reason }, 'Unhandled Promise Rejection');
});
