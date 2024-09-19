import { Request, Response } from "express";
import userSchema from "../schemas/user.schema";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis";
import { getUserByToken } from "../utils/getUserByToken";

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    `${process.env.ACCESS_TOKEN_SECRET}`,
    {
      expiresIn: "15m",
    }
  );
  const refreshToken = jwt.sign(
    { userId },
    `${process.env.REFRESH_TOKEN_SECRET}`,
    {
      expiresIn: "7d",
    }
  );
  return { refreshToken, accessToken };
};

const storeRefreshToken = async (userId: string, refreshToken: string) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { username, firstName, lastName, email, password } = req.body;

    const user = await userSchema.findOne({ username });

    if (user) {
      return res
        .status(400)
        .json({ error: `Username: ${username} already taken` });
    }

    const userEmail = await userSchema.findOne({ email });

    if (userEmail) {
      return res.status(400).json({ error: `Email: ${email} already exists` });
    }

    const newUser = new userSchema({
      username,
      firstName,
      lastName,
      email,
      password,
    });

    await newUser.save();

    if (newUser) {
      const { accessToken, refreshToken } = generateTokens(newUser._id);
      await storeRefreshToken(newUser._id, refreshToken);
      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        cartItems: newUser.cartItems,
        product: newUser.product,
        role: newUser.role,
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body; // identifier can be username or email

    const user = await userSchema
      .findOne({
        $or: [{ username: identifier }, { email: identifier }],
      })
      .select("+password");

    if (!user) {
      res.status(400).json({ error: "User doesn't exist" });
    }

    if (user) {
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        const { accessToken, refreshToken } = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);
        res.status(201).json({
          _id: user._id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          cartItems: user.cartItems,
          product: user.product,
          role: user.role,
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      } else {
        return res.status(400).json({ error: "Invalid password" });
      }
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;
    if (refresh_token) {
      const decoded = jwt.verify(
        refresh_token,
        `${process.env.REFRESH_TOKEN_SECRET}`
      ) as jwt.JwtPayload;

      if (decoded && decoded.userId) {
        await redis.del(`_refresh_token:${decoded.userId}`);

        res.status(200).send({ message: "Logout successful" });
      } else {
        res.status(400).send({ message: "Invalid token payload" });
      }
    } else {
      res.status(401).send({ message: "No token provided" });
    }
  } catch (err: any) {
    res.status(500).send({ message: "Invalid token" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;
    if (!refreshToken) {
      res.status(400).json({ error: "Refresh Token doesn't provided" });
    }

    const decoded = jwt.verify(
      refresh_token,
      `${process.env.REFRESH_TOKEN_SECRET}`
    ) as jwt.JwtPayload;

    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refresh_token) {
      res.status(401).json({ error: "Refresh Token is invalid" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      `${process.env.ACCESS_TOKEN_SECRET}`,
      {
        expiresIn: "15m",
      }
    );

    res.status(201).json({ access_token: accessToken });
  } catch (err: any) {
    res.status(500).send({ message: "Invalid token" });
  }
};

export const getUserData = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization!;
    const user = await getUserByToken(accessToken);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err: any) {
    res.status(500).send({ message: err.message });
  }
};
