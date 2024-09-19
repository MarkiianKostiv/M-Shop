export interface IUser {
  username: string;
  email: string;
  _id: string;
  firstName: string;
  lastName: string;
  password: string;
  role: "admin" | "customer";
  access_token: string;
  refresh_token: string;
}
