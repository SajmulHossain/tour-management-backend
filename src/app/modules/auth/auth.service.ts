import { hashPassword, hashPassword } from "./../../utils/hashPassword";
import { compare, hash } from "bcryptjs";
import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env.config";
import AppError from "../../errorHelpers/AppError";
import {
  createNewAccessTokenWithRefreshToken,
  createUserToken,
} from "../../utils/userToken";
import { IAuthProvider, IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "No account with this email");
  }

  const isPasswordMatched = await compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  }

  const { accessToken, refreshToken } = createUserToken(isUserExist);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accessToken,
    refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return { accessToken: newAccessToken };
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  id: string
) => {
  const user = await User.findById(id);
  const isOldPasswordMatch = await compare(
    oldPassword,
    user?.password as string
  );

  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old Password didn't matched");
  }

  await User.findByIdAndUpdate(id, {
    password: await hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND)),
  });
};

const resetPassword = () => {
  return;
};

const setPassword = async (userId: string, password: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (
    user.password &&
    user.auths.some((providerObj) => providerObj.provider === "google")
  ) {
    throw new AppError(
      400,
      "You have already set your password. Now you can change your password from profile"
    );
  }

  const hashedPassword = await hashPassword(password);

  const auths: IAuthProvider[] = [
    ...user.auths,
    { provider: "credentials", providerId: user.email },
  ];

  user.password = hashedPassword;
  user.auths = auths;

  await user.save();
};

export const AuthServices = {
  credentialLogin,
  getNewAccessToken,
  changePassword,
  resetPassword,
  setPassword,
};
