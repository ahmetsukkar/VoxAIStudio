import type { Metadata } from "next";
import Link from "next/link";

import { Calendar, Clock, Tag, TrendingUp } from "lucide-react";
import {
  getBlogCategories,
  getFeaturedBlogPosts,
  getPublishedBlogPosts,
} from "~/lib/blog";
import AuthCTA from "~/components/auth-cta";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog - Vox AI Studio | AI Voice & Text-to-Speech Insights",
  description:
    "Explore guides, tutorials, and insights about AI voice technology, text-to-speech, voice cloning, and content creation.",
  keywords:
    "AI voice blog, text-to-speech guides, voice cloning tutorials, TTS technology",
};

export default async function BlogPage() {
  const postsResult = await getPublishedBlogPosts();
  const featuredResult = await getFeaturedBlogPosts();
  const categoriesResult = await getBlogCategories();

  const posts = postsResult.success ? (postsResult.data ?? []) : [];
  const featuredPosts = featuredResult.success
    ? (featuredResult.data ?? [])
    : [];
  const categories = categoriesResult.success
    ? (categoriesResult.data ?? [])
    : [];

  console.log("Blog posts fetched:", posts);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 py-16 text-white md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
              Vox AI Studio Blog
            </h1>
            <p className="text-xl text-purple-100 md:text-2xl">
              Insights, guides, and best practices for AI voice technology
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Content */}
          <div className="flex-1">
            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <section className="mb-12">
                <div className="mb-6 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <h2 className="text-3xl font-bold">Featured Articles</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {featuredPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-400">
                        <div className="absolute inset-0 flex items-center justify-center text-6xl text-white">
                          📝
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="mb-3 flex items-center gap-3 text-sm text-gray-600">
                          <span className="rounded-full bg-purple-100 px-3 py-1 font-medium text-purple-700">
                            {post.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readingTime}
                          </span>
                        </div>
                        <h3 className="mb-2 line-clamp-2 text-xl font-bold transition-colors group-hover:text-purple-600">
                          {post.title}
                        </h3>
                        <p className="mb-4 line-clamp-2 text-gray-600">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span className="font-medium">{post.authorName}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.publishedAt!).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* All Posts */}
            <section>
              <h2 className="mb-6 text-3xl font-bold">All Articles</h2>
              <div className="space-y-6">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl sm:flex-row"
                  >
                    <div className="relative h-48 w-full flex-shrink-0 bg-gradient-to-br from-purple-400 to-blue-400 sm:h-auto sm:w-64">
                      <div className="absolute inset-0 flex items-center justify-center text-5xl text-white">
                        📝
                      </div>
                    </div>
                    <div className="flex-1 p-6">
                      <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <span className="rounded-full bg-purple-100 px-3 py-1 font-medium text-purple-700">
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.readingTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.publishedAt!).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      <h3 className="mb-2 text-2xl font-bold transition-colors group-hover:text-purple-600">
                        {post.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-gray-600">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">
                          {post.authorName}
                        </span>
                        {post.tags.length > 0 && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Tag className="h-4 w-4" />
                            <span>{post.tags[0]}</span>
                            {post.tags.length > 1 && (
                              <span>+{post.tags.length - 1}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}

                {posts.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-lg text-gray-500">
                      No blog posts found.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:w-80">
            {/* Categories */}
            {categories.length > 0 && (
              <div className="rounded-xl bg-white p-6 shadow-md">
                <h3 className="mb-4 text-xl font-bold">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/blog?category=${encodeURIComponent(category)}`}
                      className="block rounded-lg px-4 py-2 transition-colors hover:bg-purple-50 hover:text-purple-600"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Box */}
            <div className="rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 p-6 text-white shadow-lg">
              <h3 className="mb-3 text-xl font-bold">Try Vox AI Studio</h3>
              <p className="mb-4 text-purple-100">
                Transform your text into natural-sounding speech in seconds.
              </p>
              <AuthCTA
                label="Start Free Trial"                
                size="lg"
                className="w-full bg-white text-purple-600 hover:bg-purple-50"
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
