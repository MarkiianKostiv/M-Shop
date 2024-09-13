import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userSchema from "../schemas/user.schema";
export const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const accessToken = authHeader.split(" ")[1];

      const decoded = jwt.verify(
        accessToken,
        `${process.env.ACCESS_TOKEN_SECRET}`
      ) as jwt.JwtPayload;

      const user = await userSchema.findById(decoded.userId);

      if (!user) {
        res.status(404).json({ massage: "User doesn't exist" });
      }

      next();
    } else {
      res.status(401).json({ massage: "No access token provided" });
    }
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }
    res.status(500).send({ message: err.massage });
  }
};

export const adminRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const accessToken = authHeader.split(" ")[1];

      const decoded = jwt.verify(
        accessToken,
        `${process.env.ACCESS_TOKEN_SECRET}`
      ) as jwt.JwtPayload;

      const user = await userSchema.findById(decoded.userId);

      if (!user) {
        res.status(404).json({ massage: "User doesn't exist" });
      }

      if (user?.role !== "admin") {
        res.status(401).json({ massage: "User doesn't have access rights" });
      }

      next();
    } else {
      res.status(401).json({ massage: "No access token provided" });
    }
  } catch (err: any) {
    res.status(500).send({ message: err.massage });
  }
};
