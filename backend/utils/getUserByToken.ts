import jwt from "jsonwebtoken";
import userSchema from "../schemas/user.schema";

export const getUserByToken = async (token: string) => {
  const accessToken = token.split(" ")[1];
  if (accessToken) {
    const decoded = jwt.verify(
      accessToken,
      `${process.env.ACCESS_TOKEN_SECRET}`
    ) as jwt.JwtPayload;

    const user = await userSchema.findById(decoded.userId);

    return user;
  }
};
