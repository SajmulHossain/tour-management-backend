/* eslint-disable no-console */
import { createClient } from "redis";
import { envVars } from "./env.config";

export const redisClient = createClient({
  username: envVars.REDIS.REDIST_USERNAME,
  password: envVars.REDIS.REDIST_PASSWORD,
  socket: {
    host: envVars.REDIS.REDIS_HOST,
    port: parseInt(envVars.REDIS.REDIS_PORT),
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Redis Connected");
  }
};
