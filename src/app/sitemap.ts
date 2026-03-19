import { getPublishedBlogPosts } from "~/lib/blog";
import { env } from "~/env";

export const revalidate = 3600

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
  }));

  const postsResult = await getPublishedBlogPosts();

  const blogEntries =
    postsResult.success && postsResult.data
      ? postsResult.data.map((post) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: post.updatedAt ?? post.publishedAt! ?? new Date(),
        }))
      : [];

  return [...staticEntries, ...blogEntries];
}
