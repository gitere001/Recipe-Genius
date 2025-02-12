import { createClient } from "redis";


const redisClient = createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("connect", () => {
  console.log("✅ Redis connected successfully!");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});


export default redisClient;
