import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
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
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "~/lib/email/send-email";
import { verifyEmailTemplate } from "~/lib/email/templates/verify-email";
import { resetPasswordTemplate } from "~/lib/email/templates/reset-password";

const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: "production",
});

const PLAN_CREDITS: Record<string, number> = {
  "REPLACE_WITH_PROD_ID_START":   40_000,
  "REPLACE_WITH_PROD_ID_CREATOR": 125_000,
  "REPLACE_WITH_PROD_ID_PRO":     400_000,
};

const FREE_TRIAL_DAYS = 7;

export const auth = betterAuth({
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh session once per day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 15, // cache for 15 minutes (in seconds)
    },
  },
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
  trustedOrigins: [env.BETTER_AUTH_WWWURL, env.BETTER_AUTH_URL],
  database: prismaAdapter(db, { 
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({
      user,
      url,
    }: {
      user: { email: string; name?: string | null };
      url: string;
    }) => {
      try {
        const html = resetPasswordTemplate(user.name ?? "there", url);
        await sendResetPasswordEmail(user, url, html);
      } catch (error) {
        console.error("Failed to send reset password email:", error);
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({
      user,
      url,
    }: {
      user: { email: string; name?: string | null };
      url: string;
    }) => {
      try {
        const html = verifyEmailTemplate(user.name ?? "there", url);
        await sendVerificationEmail(user, url, html);
      } catch (error) {
        console.error("Failed to send verification email:", error);
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Set trial expiry for every new sign-up
          const trialExpiresAt = new Date();
          trialExpiresAt.setDate(trialExpiresAt.getDate() + FREE_TRIAL_DAYS);
          await db.user.update({
            where: { id: user.id },
            data: { trialExpiresAt },
          });
        },
      },
    },
  },
  plugins: [
    admin(),
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            { 
              productId: "REPLACE_WITH_PROD_ID_START",  
              slug: "start",
            },
            { 
              productId: "REPLACE_WITH_PROD_ID_CREATOR", 
              slug: "creator",
            },
            { 
              productId: "REPLACE_WITH_PROD_ID_PRO",
              slug: "pro",
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
             if (!productId) {
              console.error("No product ID found in order data.");
              throw new Error("No product id found in order data.");
            }
            const creditsToAdd = PLAN_CREDITS[productId] ?? 0;
            if (creditsToAdd === 0) {
              console.warn(`Unknown productId in onOrderPaid: ${productId}`);
              return;
            }

            await db.user.update({
              where: { id: externalCustomerId },
              data: {
                credits: {
                  increment: creditsToAdd,
                },
                // Clear trial expiry when user upgrades to a paid plan
                trialExpiresAt: null,
              },
            });
          },
        }),
      ],
    }),
  ],
});
