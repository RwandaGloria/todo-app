import express from "express"
import * as dotenv from "dotenv";
import { syncModels } from "./models/syncModel";
dotenv.config();
export const app = express();

const PORT = process.env.PORT || 3400;
app.listen(PORT, async() => {
    await syncModels()
  console.log(`Server is running on port ${PORT}`);
});
