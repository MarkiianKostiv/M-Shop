import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

export const stripe = new Stripe(`${process.env.STIPE_SECRET_KEY}`);
