/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  polar,
  checkout,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { env } from "~/env";
import { db } from "~/server/db";

const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  // Use 'sandbox' if you're using the Polar Sandbox environment
  // Remember that access tokens, products, etc. are completely separated between environments.
  // Access tokens obtained in Production are for instance not usable in the Sandbox environment.
  server: "sandbox",
});

//const prisma = new PrismaClient();
export const auth = betterAuth({
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  baseURL: env.BETTER_AUTH_URL,
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
    useSecureCookies: true,
  },
  trustedOrigins: [env.BETTER_AUTH_URL],
  database: prismaAdapter(db, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "b3e419e7-3a7e-4c06-8859-fb4d03ef99ec",
              slug: "starter-plan",
            },
            {
              productId: "a17bb07f-8d75-46fe-9b18-04ae2ea46474",
              slug: "professional-creator",
            },
            {
              productId: "faf28a2b-eee3-4091-85b0-d3565552db7e",
              slug: "agency-enterprise",
            },
          ],
          successUrl: "/dashboard",
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET,
          onOrderPaid: async (order) => {
            const externalCustomerId = order.data.customer.externalId;

            if (!externalCustomerId) {
              console.error("No external customer ID found.");
              throw new Error("No external customer id found.");
            }

            const productId = order.data.productId;

            let creditsToAdd = 0;

            switch (productId) {
              case "b3e419e7-3a7e-4c06-8859-fb4d03ef99ec":
                creditsToAdd = 10000;
                break;
              case "a17bb07f-8d75-46fe-9b18-04ae2ea46474":
                creditsToAdd = 40000;
                break;
              case "faf28a2b-eee3-4091-85b0-d3565552db7e":
                creditsToAdd = 120000;
                break;
            }

            await db.user.update({
              where: { id: externalCustomerId },
              data: {
                credits: {
                  increment: creditsToAdd,
                },
              },
            });
          },
        }),
      ],
    }),
  ],
});
