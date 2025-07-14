import { compare, hash } from "bcryptjs";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import {
  createNewAccessTokenWithRefreshToken,
  createUserToken,
} from "../../utils/userToken";
import { IUser } from "../user/user.interface";
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
export const AuthServices = {
  credentialLogin,
  getNewAccessToken,
  changePassword,
};
