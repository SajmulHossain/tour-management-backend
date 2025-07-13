import { compare } from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { createUserToken } from "../../utils/userToken";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

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
  const verifyRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const { email } = verifyRefreshToken;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not exist");
  }

  if(isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
    throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`);
  }
 
  if(isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is deleted');
  }

    const jwtPayload = {
      userId: isUserExist._id,
      email: isUserExist.email,
      role: isUserExist.role,
    };
  
    const accessToken = generateToken(
      jwtPayload,
      envVars.JWT_ACCESS_SECRET,
      envVars.JWT_ACCESS_EXPIRES
    );

  return {
    accessToken
  };
};

export const AuthServices = {
  credentialLogin,
  getNewAccessToken,
};
