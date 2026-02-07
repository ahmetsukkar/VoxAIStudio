import { Suspense } from "react";
import SignInClient from "./sign-in-client";


export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="bg-background flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-card border p-6 shadow-sm">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <SignInClient  />
    </Suspense>
  );
}
