import express from "express";
import * as dotenv from "dotenv";
import { syncModels } from "./models/syncModel";
import todoRoutes from "./routes/todoRoutes";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./middleware/error";
import { route } from "./routes";
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from "./swagger"; 
import rateLimit from "express-rate-limit";
import logger from "./utils/logger";
dotenv.config();

export const app = express();
const PORT = process.env.PORT || 3400;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cors());

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150
}));
app.use(cors());

app.use("/api/v1", route);
app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(errorHandler);

let server: any

if (process.env.NODE_ENV !== 'test') {
   server = app.listen(PORT, async () => {
    await syncModels();
    console.log(`Server is running on port ${PORT}`);
  });
}

process.on('SIGTERM', () => {
  server.close(() => {
    logger.error('Process terminated');
  });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
