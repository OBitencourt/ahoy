import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";

const client = new MongoClient("mongodb://localhost:27017/ahoy");
const db = client.db();

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: mongodbAdapter(db),
  plugins: [nextCookies()]
});
