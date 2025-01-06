import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

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

  const dbLogic = ()=>{
    console.log("Hello");
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID!,
        clientSecret: process.env.CLIENT_SECRET!,
        callbackURL: `https://4cfw3zvk-5000.inc1.devtunnels.ms/auth/google/callback`,
      },
      (accessToken, refreshToken, profile, done) => {
        console.log("Google Profile:", profile);

        const userProfile: Express.User = {
          id: profile.id,
          displayName: profile.displayName,
          emails: profile.emails || [],
          photos: profile.photos || [],
          provider: profile.provider,
          accessToken,
          refreshToken,
        };

        dbLogic();

        return done(null, userProfile);
      }
      
    )
  );
};
