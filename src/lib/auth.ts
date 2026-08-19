import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: googleClientId && googleClientSecret
    ? { google: { clientId: googleClientId, clientSecret: googleClientSecret } }
    : {},
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "usuario",
        input: false,
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || "super_secret_better_auth_key_12345678",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
});
