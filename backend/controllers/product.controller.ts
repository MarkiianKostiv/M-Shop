import { Request, Response } from "express";
import productSchema from "../schemas/product.schema";
import { redis } from "../lib/redis";
import { IProduct } from "../models/product.model";
import cloudinary from "../lib/cloudinary";

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await productSchema.find({});
    if (!products) {
      res.status(400).json({ massage: "No products in the database" });
    }

    res.status(200).json({ products });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getFeaturedProducts = async (_req: Request, res: Response) => {
  try {
    let featuredProducts: IProduct[] | null = null;

    const cachedProducts = await redis.get("featured_products");

    if (cachedProducts) {
      return res
        .status(200)
        .json({ featuredProducts: JSON.parse(cachedProducts) });
    }

    featuredProducts = await productSchema.find({ isFeatured: true }).lean();

    if (!featuredProducts || featuredProducts.length === 0) {
      return res.status(404).json({ message: "No Featured products found" });
    }

    await redis.set("featured_products", JSON.stringify(featuredProducts));

    return res.status(200).json({ featuredProducts });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, image, category } = req.body;

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await productSchema.create({
      name,
      description,
      price,
      category,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
    });

    if (product) {
      res.status(201).json({ product });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await productSchema.findById(productId);

    if (product) {
      if (product.image) {
        const publicId = product.image.split("/").pop()?.split(".")[0];
        try {
          cloudinary.uploader.destroy(`products/${publicId}`);
        } catch (err: any) {}
      }

      await product.deleteOne();

      res.status(200).json({
        massage: `Product ${product?.name} with id:${productId}, successfully deleted from the database`,
      });
    } else {
      res.status(404).json({
        massage: `Product with id:${productId}, doesn't exist in database`,
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getRecommendedProducts = async (res: Response) => {
  try {
    const recommendedProducts = await productSchema.aggregate([
      { $sample: { size: 3 } },
      { $project: { _id: 1, name: 1, image: 1, description: 1, price: 1 } },
    ]);

    res.status(200).json({ recommendedProducts });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const categoryName = req.params.name;

    const products = await productSchema
      .find({ category: categoryName })
      .lean();

    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }

    res.status(200).json({ products });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleFeaturedProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await productSchema.findById(productId);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();

      await featuredProductsCache();

      res.status(200).json({ updatedProduct });
    } else {
      res
        .status(404)
        .json({ message: `Product with id: ${productId} not found` });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

async function featuredProductsCache() {
  try {
    const featuredProducts = await productSchema
      .find({ isFeatured: true })
      .lean();

    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (err: any) {
    console.error("Error in updating cache");
  }
}
