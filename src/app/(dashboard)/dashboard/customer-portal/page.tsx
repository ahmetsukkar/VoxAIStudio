import { redirect } from "next/navigation";
import CustomerPortalRedirect from "~/components/sidebar/CustomerPortalRedirect";
import { getAuthSession } from "~/lib/get-session";

export default async function CustomerPortalPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth/sign-in");

  return <CustomerPortalRedirect />;
}
