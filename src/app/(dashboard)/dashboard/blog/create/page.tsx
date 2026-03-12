import { redirect } from "next/navigation";
import CreateBlogForm from "~/components/blog/CreateBlogForm";
import { getAuthSession } from "~/lib/get-session";

export default async function CreateBlogPostPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect("/auth/sign-in?callbackUrl=/dashboard/blog/create");

  return (
    <CreateBlogForm
      userName={session.user.name ?? ""}
      userEmail={session.user.email ?? ""}
    />
  );
}
