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
import { Resend } from "resend";

const resend = new Resend(String(env.RESEND_API_KEY));

const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  // Use 'sandbox' if you're using the Polar Sandbox environment
  // Remember that access tokens, products, etc. are completely separated between environments.
  // Access tokens obtained in Production are for instance not usable in the Sandbox environment.
  server: "sandbox",
});

//const prisma = new PrismaClient();
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
    provider: "postgresql", // or "mysql", "postgresql", ...etc
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
        await resend.emails.send({
          from: "Vox AI Studio <noreply@voxaistudio.com>",
          to: user.email,
          subject: "Reset your Vox AI Studio password",
          html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;">
            <h2 style="color:#4f46e5;">Reset your password 🔐</h2>
            <p>Hi ${user.name ?? "there"},</p>
            <p>We received a request to reset your password. Click below to choose a new one.</p>
            <a href="${url}"
               style="display:inline-block;background:#4f46e5;color:white;
                      padding:12px 24px;border-radius:8px;text-decoration:none;
                      font-weight:bold;margin:16px 0;">
              Reset Password
            </a>
            <p style="color:#888;font-size:13px;">
              This link expires in 1 hour. If you didn't request this, ignore this email.
            </p>
          </div>
        `,
        });
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
        await resend.emails.send({
          from: "Vox AI Studio <noreply@voxaistudio.com>",
          to: user.email,
          subject: "Verify your Vox AI Studio email",
          html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;">
            <h2 style="color:#4f46e5;">Verify your email ✉️</h2>
            <p>Hi ${user.name ?? "there"},</p>
            <p>Thanks for signing up to Vox AI Studio! Please verify your email to secure your account.</p>
            <a href="${url}"
               style="display:inline-block;background:#4f46e5;color:white;
                      padding:12px 24px;border-radius:8px;text-decoration:none;
                      font-weight:bold;margin:16px 0;">
              Verify Email
            </a>
            <p style="color:#888;font-size:13px;">
              If you didn't create an account, you can safely ignore this email.
            </p>
          </div>
        `,
        });
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
  plugins: [
    admin(),
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
