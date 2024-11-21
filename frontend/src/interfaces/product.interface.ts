export interface IProduct {
  _id?: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  isFeatured?: boolean;
  quantity?: number;
}
