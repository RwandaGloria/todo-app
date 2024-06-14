import { createLogger, format as winstonFormat, transports } from 'winston';

const logFileName = "logs/app.log";
const errorLogFileName = "logs/error.log";

const logger = createLogger({
  level: 'info',
  format: winstonFormat.combine(
    winstonFormat.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winstonFormat.json()
  ),
  transports: [
    new transports.Console({
      level: 'info',  // Log only info level messages to the console
      format: winstonFormat.combine(
        winstonFormat.colorize(), 
        winstonFormat.simple()
      )
    }),
    new transports.File({ filename: logFileName, level: 'info' }), 
    new transports.File({ filename: errorLogFileName, level: 'error' }) 
  ],
});

export default logger;
