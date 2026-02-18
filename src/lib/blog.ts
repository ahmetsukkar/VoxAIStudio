/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "./auth";
import type { BlogStatus } from "~/types/blog";

// Get all published blog posts
export async function getPublishedBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: {
        publishedAt: "desc",
      },
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

// Get featured blog posts
export async function getFeaturedBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
        featured: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
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

// Get single blog post by slug - FIXED VERSION
export async function getBlogPostBySlug(slug: string) {
  try {
    console.log('🔍 Fetching blog post with slug:', slug); // Debug log
    
    const post = await prisma.blogPost.findFirst({
      where: {
        slug: slug,  // Make sure we're using the slug parameter
        status: 'PUBLISHED',
      },
    });

    console.log('📝 Found post:', post?.title ?? 'NOT FOUND'); // Debug log

    if (!post) {
      return { success: false, error: 'Post not found' };
    }

    // Increment views
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    return { success: true, data: post };
  } catch (error) {
    console.error('❌ Error fetching blog post:', error);
    return { success: false, error: 'Failed to fetch blog post' };
  }
}


// Get posts by category
export async function getBlogPostsByCategory(category: string) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
        category,
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

    return { success: true, data: posts };
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return { success: false, error: "Failed to fetch posts" };
  }
}

// Get all categories
export async function getBlogCategories() {
  try {
    const categories = await prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
      },
      select: {
        category: true,
      },
      distinct: ["category"],
    });

    return {
      success: true,
      data: categories.map((c) => c.category),
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

// Create new blog post (Admin only)
export async function createBlogPost(formData: FormData) {
  try {
    // Get current user session
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
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

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return { success: false, error: "A post with this slug already exists" };
    }

    // Create blog post with author assignment
    const post = await prisma.blogPost.create({
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
        authorId: session.user.id, // Assign to logged-in user
      },
    });

    revalidatePath("/blog");
    return { success: true, data: post };
  } catch (error) {
    console.error("Error creating blog post:", error);
    return { success: false, error: "Failed to create blog post" };
  }
}

// Search blog posts
export async function searchBlogPosts(query: string) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
          { tags: { has: query } },
        ],
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

    return { success: true, data: posts };
  } catch (error) {
    console.error("Error searching posts:", error);
    return { success: false, error: "Failed to search posts" };
  }
}
