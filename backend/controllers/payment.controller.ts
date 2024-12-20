import { Request, Response } from "express";
import { getUserByToken } from "../utils/getUserByToken";
import couponSchema from "../schemas/coupon.schema";
import { stripe } from "../lib/strirpe";
import { ICoupon } from "../models/coupon.model";
import orderSchema from "../schemas/order.schema";
import { IStripeProduct } from "../models/order.model";
import { createStripeCoupon } from "../utils/createStripeCoupon";
import { createNewCoupon } from "../utils/createNewCoupon";

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { products, couponCode } = req.body;

    const token = req.headers.authorization!;

    const user = await getUserByToken(token);

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }

    let totalAmount = 0;
    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100); // need format of cents for stripe
      totalAmount += product.quantity;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
      };
    });

    let coupon: ICoupon | null = null;

    if (couponCode) {
      coupon = await couponSchema.findOne({
        userId: user?._id,
        isActive: true,
      });

      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.disCountPercentage) / 100
        );
      }
    }

    if (user) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
        discounts: coupon
          ? [
              {
                coupon: await createStripeCoupon(coupon.disCountPercentage),
              },
            ]
          : [],
        metadata: {
          userId: user?._id.toString(),
          couponCode: couponCode || "",
          products: JSON.stringify(
            products.map((p) => ({
              id: p._id,
              quantity: p.quantity,
              price: p.price,
            }))
          ),
        },
      });

      if (totalAmount >= 2000) {
        await createNewCoupon(user._id);
      }

      res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const checkoutSuccess = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      if (session.metadata?.couponCode) {
        await couponSchema.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          { isActive: false }
        );
      }

      const products: IStripeProduct[] = JSON.parse(session.metadata!.products);

      const newOrder = new orderSchema({
        user: session.metadata!.userId,
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total! / 100,
        stripeSessionId: sessionId,
      });

      await newOrder.save();

      res.status(200).json({
        success: true,
        message:
          "Payment successful, order created, and coupon deactivated if used.",
        orderId: newOrder._id,
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
