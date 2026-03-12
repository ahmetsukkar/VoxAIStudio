"use server";

import { db } from "~/server/db";
import { revalidatePath } from "next/cache";
import { getAuthSession } from "~/lib/get-session";
import type { BlogStatus } from "~/types/blog";

export async function getPublishedBlogPosts() {
  try {
    const posts = await db.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        tags: true,
        authorName: true,
        authorAvatar: true,
        featuredImage: true,
        readingTime: true,
        updatedAt: true,
        publishedAt: true,
        featured: true,
        views: true,
      },
    });
    return { success: true, data: posts };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return { success: false, error: "Failed to fetch blog posts" };
  }
}

export async function getFeaturedBlogPosts() {
  try {
    const posts = await db.blogPost.findMany({
      where: { status: "PUBLISHED", featured: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        authorName: true,
        readingTime: true,
        publishedAt: true,
        featuredImage: true,
      },
    });
    return { success: true, data: posts };
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return { success: false, error: "Failed to fetch featured posts" };
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const post = await db.blogPost.findFirst({
      where: { slug, status: "PUBLISHED" },
    });

    if (!post) return { success: false, error: "Post not found" };

    await db.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    return { success: true, data: post };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return { success: false, error: "Failed to fetch blog post" };
  }
}

export async function getBlogPostsByCategory(category: string) {
  try {
    const posts = await db.blogPost.findMany({
      where: { status: "PUBLISHED", category },
      orderBy: { publishedAt: "desc" },
    });
    return { success: true, data: posts };
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return { success: false, error: "Failed to fetch posts" };
  }
}

export async function getBlogCategories() {
  try {
    const categories = await db.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { category: true },
      distinct: ["category"],
    });
    return { success: true, data: categories.map((c) => c.category) };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function createBlogPost(formData: FormData) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to create a blog post",
      };
    }

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const tags = (formData.get("tags") as string)
      .split(",")
      .map((tag) => tag.trim());
    const authorName = formData.get("authorName") as string;
    const readingTime = formData.get("readingTime") as string;
    const featured = formData.get("featured") === "true";
    const status = formData.get("status") as BlogStatus;

    const existingPost = await db.blogPost.findUnique({ where: { slug } });
    if (existingPost) {
      return { success: false, error: "A post with this slug already exists" };
    }

    const post = await db.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        tags,
        authorName,
        readingTime,
        featured,
        status,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        authorId: session.user.id,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    return { success: true, data: post };
  } catch (error) {
    console.error("Error creating blog post:", error);
    return { success: false, error: "Failed to create blog post" };
  }
}

export async function searchBlogPosts(query: string) {
  try {
    const posts = await db.blogPost.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
          { tags: { has: query } },
        ],
      },
      orderBy: { publishedAt: "desc" },
    });
    return { success: true, data: posts };
  } catch (error) {
    console.error("Error searching posts:", error);
    return { success: false, error: "Failed to search posts" };
  }
}

export async function getAdjacentPosts(slug: string, publishedAt: Date) {
  try {
    const [prevPost, nextPost] = await Promise.all([
      db.blogPost.findFirst({
        where: { status: "PUBLISHED", publishedAt: { lt: publishedAt } },
        orderBy: { publishedAt: "desc" },
        select: { slug: true, title: true, category: true, readingTime: true },
      }),
      db.blogPost.findFirst({
        where: { status: "PUBLISHED", publishedAt: { gt: publishedAt } },
        orderBy: { publishedAt: "asc" },
        select: { slug: true, title: true, category: true, readingTime: true },
      }),
    ]);
    return { success: true, data: { prevPost, nextPost } };
  } catch (error) {
    console.error("Error fetching adjacent posts:", error);
    return { success: false, data: { prevPost: null, nextPost: null } };
  }
}

export async function getRelatedPosts(slug: string, category: string) {
  try {
    const posts = await db.blogPost.findMany({
      where: { status: "PUBLISHED", category, slug: { not: slug } },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        readingTime: true,
        publishedAt: true,
        authorName: true,
      },
    });
    return { success: true, data: posts };
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return { success: false, data: [] };
  }
}
