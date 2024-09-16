import { Response } from "express";
import userSchema from "../schemas/user.schema";
import productSchema from "../schemas/product.schema";
import orederSchema from "../schemas/oreder.schema";

function getDatesInRange(startDate: Date, endDate: Date) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

const getDailySalesData = async (startDate: Date, endDate: Date) => {
  const dailySalesData = await orederSchema.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        sales: { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const dateArray = getDatesInRange(startDate, endDate);

  return dateArray.map((date) => {
    const foundData = dailySalesData.find((item) => item._id === date);

    return {
      date,
      sales: foundData?.sales || 0,
      revenue: foundData?.revenue || 0,
    };
  });
};

export const getData = async (res: Response) => {
  try {
    const totalUsers = await userSchema.countDocuments();
    const totalProducts = await productSchema.countDocuments();

    const salesData = await orederSchema.aggregate([
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
