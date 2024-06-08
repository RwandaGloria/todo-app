import { createLogger, format as winstonFormat, transports } from 'winston';
const logFileName = "logs/app.log"
const logger = createLogger({
  level: 'info',
  format: winstonFormat.combine(
    winstonFormat.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winstonFormat.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: logFileName }),
  ],
});

export default logger;

