import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { createUser, retrieveUserByEmail } from "../utils/dbutils";
import { userModel } from "../models/User";

dotenv.config();

const SERVER_URL = process.env.BE_URL;

declare global {
  namespace Express {
    interface User {
      id: string;
      displayName: string;
      emails: { value: string }[];
      photos?: { value: string }[];
      provider: string;
      accessToken?: string;
      refreshToken?: string;
    }
  }
}


export const initializePassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user as Express.User);
  });

  const dbLogic = async(profile:any) => {
    // console.log("Hello");
    try {
      let user = await retrieveUserByEmail(profile.emails![0].value);
      console.log('user: ', user);
      if (!user) {
        user = await userModel.create({
          name: profile.displayName,
          email: profile.emails![0].value,
          profileAvatar: profile.photos![0].value,
        })
      }
      user.lastOnlineAt = new Date();
      await user.save();
    }
    catch (err) {
      console.log(err);
    }
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID!,
        clientSecret: process.env.CLIENT_SECRET!,
        callbackURL: `https://4cfw3zvk-5000.inc1.devtunnels.ms/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        // console.log("Google Profile:", profile);
        
        await dbLogic(profile);

        const userProfile: Express.User = {
          id: profile.id,
          displayName: profile.displayName,
          emails: profile.emails || [],
          photos: profile.photos || [],
          provider: profile.provider,
          accessToken,
          refreshToken,
        };


        return done(null, userProfile);
      }

    )
  );
};
