import { Response } from "express";
import userSchema from "../schemas/user.schema";
import productSchema from "../schemas/product.schema";
import orderSchema from "../schemas/order.schema";
import { getDailySalesData } from "../utils/getDailySalesData";

export const getData = async (res: Response) => {
  try {
    const totalUsers = await userSchema.countDocuments();
    const totalProducts = await productSchema.countDocuments();

    const salesData = await orderSchema.aggregate([
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: 1,
          },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const { totalRevenue, totalSales } = salesData[0] || {
      totalRevenue: 0,
      totalSales: 0,
    };

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailySalesData = await getDailySalesData(startDate, endDate);

    res.status(200).json({
      users: totalUsers,
      products: totalProducts,
      sales: totalSales,
      revenue: totalRevenue,
      dailySalesData: dailySalesData,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
