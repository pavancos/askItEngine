import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import authRoute from "./routes/authRoute";
import userRoute from "./routes/userRoute";
import router from "./routes/roomRoute";
import { initializePassport } from "./configs/passportConfig";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

dotenv.config();
mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });

const app: Application = express();
const FE_URL = process.env.FE_URL;

app.use(
  cors({
    origin: [
      FE_URL!,
      "https://zn12df18-5173.inc1.devtunnels.ms/profile",
      "https://zn12df18-5173.inc1.devtunnels.ms",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Set-Cookie"]
  })
);



app.options("https://zn12df18-5173.inc1.devtunnels.ms", cors());
app.use(express.json());

// app.use(
//   session({
//     name: "Session",
//     secret: process.env.SESSION_SECRET || "SECRET",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: false,
//       httpOnly: true,
//     },
//   })
// );
app.use(
  session({
    name: "Session",
    secret: process.env.SESSION_SECRET || "SECRET",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      collectionName: "sessions",
    }),
    cookie: {
      secure: false,//THIS is the False thats working
      // secure:true,
      sameSite: "lax",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    }
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());
// 2025-02-12T15:07:21.042Z

app.use((req, res, next) => {
  console.log("Session:", req.session);
  console.log("User:", req.user);
  next();
});

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/room", router);
app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});

const server = http.createServer(app);

export { server };