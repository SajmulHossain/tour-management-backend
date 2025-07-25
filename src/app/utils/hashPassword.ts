import { hash } from "bcryptjs";
import { envVars } from "../config/env.config";

export const hashPassword = async (password: string) => {
  return await hash(password, Number(envVars.BCRYPT_SALT_ROUND));
};
