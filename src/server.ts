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
const app: Application = express();
dotenv.config();
mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("Connected to MongoDB");
    const FE_URL = process.env.FE_URL;
    app.set("trust proxy",1);
    app.use(
      cors({
        origin: [
          FE_URL!,
          "https://zn12df18-5173.inc1.devtunnels.ms/profile",
          "https://zn12df18-5173.inc1.devtunnels.ms",
          "https://4cfw3zvk-5173.inc1.devtunnels.ms/profile",
          "https://4cfw3zvk-5173.inc1.devtunnels.ms",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization", "Set-Cookie"]
      })
    );



    app.options("https://zn12df18-5173.inc1.devtunnels.ms", cors());
    // app.options("https://4cfw3zvk-5173.inc1.devtunnels.ms", cors());
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
          secure: true,
          sameSite: "none",
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
        }
      })
    );

    initializePassport();
    app.use(passport.initialize());
    app.use(passport.session());


    app.use((req, res, next) => {
      console.log("Session:", req.session);
      console.log("Cookies:", req.headers.cookie);
      console.log("User:", req.user);
      next();
    });
  
    app.get("/debug-session", (req: Request, res: Response) => {
      res.json({
        session: req.session,
        user: req.user,
      });
    });


    app.use("/auth", authRoute);
    app.use("/user", userRoute);
    app.use("/room", router);
    app.get("/", (req: Request, res: Response) => {
      res.send("Server is running!");
    });


  })
  .catch((err) => {
    console.error(err);
  });

const server = http.createServer(app);

export { server };
