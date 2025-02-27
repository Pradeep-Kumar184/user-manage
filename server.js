import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDb from "./config/db.js";
import authRoute from "./routes/authRoute.js" 
import cors from "cors";


// config dotenv
dotenv.config();
// database config
connectDb();

const app = express();
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(morgan("dev"));
app.use(cors());

// route
app.use("/api/v1/auth", authRoute);

// rest api
app.get("/", (req, res) => {
  res.send("welcome to User-manage App");
});

// port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`.bgCyan.yellow);
});

