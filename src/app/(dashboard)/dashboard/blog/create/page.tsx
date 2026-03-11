import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import CreateBlogForm from "~/components/blog/CreateBlogForm";

export default async function CreateBlogPostPage() {
  // Get session using your Better Auth method
  const session = await auth.api.getSession({ headers: await headers() });

  // Redirect to sign-in if not authenticated
  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/dashboard/blog/create");
  }

  return (
    <CreateBlogForm
      userName={session.user.name ?? ""}
      userEmail={session.user.email ?? ""}
    />
  );
}
