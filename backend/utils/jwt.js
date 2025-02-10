import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config()

console.log(process.env.JWT_SECRET);
console.log(process.env.REFRESH_TOKEN_SECRET,);


export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};
