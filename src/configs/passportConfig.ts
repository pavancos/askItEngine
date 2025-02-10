import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { createUser, retrieveUserByEmail } from "../utils/dbutils";
import { userModel } from "../models/User";
import { jwtTokenVerification,TokenGeneration } from "../utils/authutils";


dotenv.config();


declare global {
  namespace Express {
    interface User {
      _id?:string;
      id: string;
      displayName: string;
      emails: { value: string }[];
      photos?: { value: string }[];
      provider: string;
      accessToken?: string;
      refreshToken?: string;
      token?: string;
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
    // console.log("DB logic called");
    try {
      let user = await retrieveUserByEmail(profile.emails![0].value);
      console.log('user: ', user);
      if (!user) {
        user = await userModel.create({
          id: profile.id,
          name: profile.displayName,
          email: profile.emails![0].value,
          profileAvatar: profile.photos![0].value
        })
      }
      user.lastOnlineAt = new Date();
      await user.save();
      return {
        _id: user._id,
        email: user.email
      };
    }
    catch (err) {
      console.log(err);
      return null;
    }
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID!,
        clientSecret: process.env.CLIENT_SECRET!,
        // callbackURL: `https://askitengine-production.up.railway.app/auth/google/callback`,
        callbackURL: `https://askitengine.vercel.app/auth/google/callback`,
        // callbackURL: `https://4cfw3zvk-5000.inc1.devtunnels.ms/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        // console.log("Google Profile:", profile);
        
        const user = await dbLogic(profile);

        // jwt
        let token;
        if(user){
          token = TokenGeneration(user);
          console.log('token: ', token);
          const userProfile: Express.User = {
            _id: user?._id as unknown as string,
            id: profile.id,
            displayName: profile.displayName,
            emails: profile.emails || [],
            photos: profile.photos || [],
            provider: profile.provider,
            accessToken,
            refreshToken,
            token
          };
          return done(null, userProfile);

        }
        else {
          return done(null, false);
        }

      }

    )
  );
};
