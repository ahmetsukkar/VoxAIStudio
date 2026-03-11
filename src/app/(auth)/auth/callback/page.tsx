import { Suspense } from "react";
import CallbackClient from "./callback-client";

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-r-transparent"></div>
          <h2 className="text-xl font-semibold">Verifying your account...</h2>
          <p className="text-muted-foreground mt-2">Please wait</p>
        </div>
      </div>
    }>
      <CallbackClient />
    </Suspense>
  );
}
