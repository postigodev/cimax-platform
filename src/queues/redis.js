import IORedis from "ioredis";
import env from "../config/env";

let connection;

export const getRedisConnection = () => {
  if (!connection) {
    connection = new IORedis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
  }

  return connection;
};

export const closeRedisConnection = async () => {
  if (connection) {
    await connection.quit();
    connection = undefined;
  }
};
