import { polarClient } from "@polar-sh/better-auth";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [polarClient()],
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signOut, signUp, useSession, deleteUser } = authClient;