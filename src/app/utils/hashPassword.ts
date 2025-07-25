import { hash } from "bcryptjs";
import { envVars } from "../config/env.config";

export const hashPassword = async (password: string) => {
  const saltRound = Number(envVars.BCRYPT_SALT_ROUND);
  return await hash(password, saltRound);
};
