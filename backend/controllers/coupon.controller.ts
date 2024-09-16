import { Request, Response } from "express";
import { getUserByToken } from "../utils/getUserByToken";
import couponSchema from "../schemas/coupon.schema";

export const getCoupon = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization!;

    const user = await getUserByToken(token);

    const coupon = await couponSchema.findOne({
      userId: user?._id,
      isActive: true,
    });

    res.status(200).json(coupon || null);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const token = req.headers.authorization!;
    const user = await getUserByToken(token);
    const coupon = await couponSchema.findOne({
      code: code,
      userId: user?._id,
    });

    if (coupon) {
      if (coupon?.expirationDate < new Date()) {
        coupon.isActive = false;
        await coupon.save();
        res.status(404).json({ message: `Coupon: ${code} expired` });
      }

      res.json({
        message: "Coupon is active",
        code: coupon.code,
        disCountPercentage: coupon.disCountPercentage,
      });
    } else {
      res.status(404).json({ message: `Coupon: ${code} not found` });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
