import express from "express";
import * as dotenv from "dotenv";
import { syncModels } from "./models/syncModel";
import todoRoutes from "./routes/todoRoutes";
import { errorHandler } from "./middleware/error";
import { route } from "./routes";
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from "./swagger"; 
dotenv.config();

export const app = express();
const PORT = process.env.PORT || 3400;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/v1", route);
app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(errorHandler);

app.listen(PORT, async () => {
  await syncModels();
  console.log(`Server is running on port ${PORT}`);
});
