import { env } from "~/env";

export default function robots() {
  const baseUrl =  env.BETTER_AUTH_WWWURL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
