import express from "express";
import * as dotenv from "dotenv";
import { syncModels } from "./models/syncModel";
import todoRoutes from "./routes/todoRoutes";
import { errorHandler } from "./middleware/error";
import { route } from "./routes";

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 3400;
app.use(errorHandler);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/v1",route);
app.use(errorHandler)

app.get("/", async (req, res) => {
  console.log("hi")
  res.send("Hello!");
});

app.listen(PORT, async () => {
  await syncModels();
  console.log(`Server is running on port ${PORT}`);
});
