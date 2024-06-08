import express from "express"
import * as dotenv from "dotenv";
import { checkConnection } from "./db/db";
dotenv.config();
export const app = express();

const PORT = process.env.PORT || 3400;
app.listen(PORT, async() => {
    // await checkConnection()
  console.log(`Server is running on port ${PORT}`);
});
