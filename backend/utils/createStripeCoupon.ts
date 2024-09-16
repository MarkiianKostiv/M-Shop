import { stripe } from "../lib/strirpe";

export const createStripeCoupon = async (disCountPercentage: number) => {
  const coupon = await stripe.coupons.create({
    percent_off: disCountPercentage,
    duration: "once",
  });

  return coupon.id;
};
