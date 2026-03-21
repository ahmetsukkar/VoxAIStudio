import { getPublishedBlogPosts } from "~/lib/blog";
import { env } from "~/env";

export const revalidate = 3600;

const priorityMap: Record<string, number> = {
  "": 1.0,
  "/blog": 0.9,
  "/faq": 0.7,
  "/contact": 0.5,
  "/legal/about": 0.4,
  "/legal/privacy": 0.3,
  "/legal/terms": 0.3,
};

const frequencyMap: Record<string, string> = {
  "": "weekly",
  "/blog": "daily",
  "/faq": "monthly",
  "/contact": "monthly",
  "/legal/about": "yearly",
  "/legal/privacy": "yearly",
  "/legal/terms": "yearly",
};

export default async function sitemap() {
  const baseUrl = env.BETTER_AUTH_WWWURL;

  const staticRoutes = [
    "",
    "/blog",
    "/contact",
    "/faq",
    "/legal/about",
    "/legal/privacy",
    "/legal/terms",
  ];

  const staticEntries = staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: (frequencyMap[path] ?? "monthly") as
      | "weekly"
      | "daily"
      | "monthly"
      | "yearly",
    priority: priorityMap[path] ?? 0.5,
  }));

  const postsResult = await getPublishedBlogPosts();

  const blogEntries =
    postsResult.success && postsResult.data
      ? postsResult.data.map((post) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: post.updatedAt ?? post.publishedAt ?? new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
      : [];

  return [...staticEntries, ...blogEntries];
}
