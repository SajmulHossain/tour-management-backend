/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env.config";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import { compare } from "bcryptjs";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done: any) => {
      try {
        const isUserExist = await User.findOne({ email });

        if (!isUserExist) {
          // return done(null, false, { message: "User does not exist" });
          return done("User does not exist");
        }

        // * checking if the user is google authenticated, because it will skip the password
        const isGoogleAuthenticated = isUserExist.auths.some(auth => auth.provider === "google");

        if(isGoogleAuthenticated && !isUserExist.password) {
          // return done(null, false, {message: "You are google authenticated. Login in with google or set a password"})
          return done(
            "You are google authenticated. Login in with google or set a password"
          );
        }



        const isPasswordMatched = await compare(
          password as string,
          isUserExist.password as string
        );

        if (!isPasswordMatched) {
          return done(null, false, { message: "Password does not matched" });
        }

        return done(null, isUserExist);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      const email = profile.emails?.[0].value;

      if (!email) {
        return done(null, false, { message: "No email found" });
      }

      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          email,
          name: profile.displayName,
          picture: profile.photos?.[0].value,
          role: Role.USER,
          isVerified: true,
          auths: [
            {
              provider: "google",
              providerId: profile.id,
            },
          ],
        });

        return done(null, user);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  const user = await User.findById(id);
  done(null, user);
});
