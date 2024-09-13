import { Request, Response } from "express";
import { getUserByToken } from "../utils/getUserByToken";
import productSchema from "../schemas/product.schema";

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const accessToken = req.headers.authorization!;
    const user = await getUserByToken(accessToken);
    if (user) {
      const existingItem = user.cartItems.find(
        (item) => item.product.toString() === productId
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        user.cartItems.push({ product: productId, quantity: 1 });
      }

      await user.save();

      res.status(201).json(user.cartItems);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAllFromCart = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const accessToken = req.headers.authorization!;
    const user = await getUserByToken(accessToken);
    if (user) {
      if (productId) {
        user.cartItems = [];
      } else {
        user.cartItems.filter((item) => item.product.toString() !== productId);
      }

      await user.save();

      res.status(201).json(user.cartItems);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateQuantity = async (req: Request, res: Response) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const accessToken = req.headers.authorization!;
    const user = await getUserByToken(accessToken);
    if (user) {
      const existingItem = user.cartItems.find(
        (item) => item.product.toString() === productId
      );
      if (existingItem) {
        if (quantity === 0) {
          user.cartItems.filter(
            (item) => item.product.toString() !== productId
          );
          await user.save();
          res.status(201).json(user.cartItems);
        }

        existingItem.quantity = quantity;
        await user.save();

        res.status(201).json(user.cartItems);
      } else {
        res.status(404).json({ massage: "Product not found" });
      }
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getCartProducts = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization!;
    const user = await getUserByToken(accessToken);
    if (user) {
      const productIds = user.cartItems.map((item) => item.product);

      const productItemsInCart = await productSchema.find({
        _id: { $in: productIds },
      });

      const productsWithQuantity = productItemsInCart.map((product) => {
        const cartItem = user.cartItems.find(
          (item) => item.product.toString() === product._id.toString()
        );
        return {
          ...product.toObject(),
          quantity: cartItem?.quantity,
        };
      });

      res.status(200).json(productsWithQuantity);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
