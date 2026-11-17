import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { sendMagicLinkEmail } from "./email";
import { MONGODB_URI } from "./env";

const globalForAuth = globalThis as unknown as {
  authMongoClient?: MongoClient;
};

const client = globalForAuth.authMongoClient ?? new MongoClient(MONGODB_URI);
globalForAuth.authMongoClient = client;

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLinkEmail(email, url);
      },
    }),
    nextCookies(),
  ],
});
