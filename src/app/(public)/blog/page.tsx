/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { Metadata } from 'next';
import Link from 'next/link';

import { Calendar, Clock, Tag, TrendingUp } from 'lucide-react';
import { getBlogCategories, getFeaturedBlogPosts, getPublishedBlogPosts } from '~/lib/blog';


export const metadata: Metadata = {
  title: 'Blog - Vox AI Studio | AI Voice & Text-to-Speech Insights',
  description: 'Explore guides, tutorials, and insights about AI voice technology, text-to-speech, voice cloning, and content creation.',
  keywords: 'AI voice blog, text-to-speech guides, voice cloning tutorials, TTS technology',
};

export default async function BlogPage() {
  const postsResult = await getPublishedBlogPosts();
  const featuredResult = await getFeaturedBlogPosts();
  const categoriesResult = await getBlogCategories();

  const posts = postsResult.success ? postsResult.data ?? [] : [];
  const featuredPosts = featuredResult.success ? featuredResult.data ?? [] : [];
  const categories = categoriesResult.success ? categoriesResult.data ?? [] : [];

  console.log("Blog posts fetched:", posts);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Vox AI Studio Blog
            </h1>
            <p className="text-xl md:text-2xl text-purple-100">
              Insights, guides, and best practices for AI voice technology
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  <h2 className="text-3xl font-bold">Featured Articles</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-400">
                        <div className="absolute inset-0 flex items-center justify-center text-white text-6xl">
                          📝
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                            {post.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readingTime}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span className="font-medium">{post.authorName}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.publishedAt!).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
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
              <h2 className="text-3xl font-bold mb-6">All Articles</h2>
              <div className="space-y-6">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row"
                  >
                    <div className="relative w-full sm:w-64 h-48 sm:h-auto bg-gradient-to-br from-purple-400 to-blue-400 flex-shrink-0">
                      <div className="absolute inset-0 flex items-center justify-center text-white text-5xl">
                        📝
                      </div>
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readingTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.publishedAt!).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">{post.authorName}</span>
                        {post.tags.length > 0 && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Tag className="w-4 h-4" />
                            <span>{post.tags[0]}</span>
                            {post.tags.length > 1 && <span>+{post.tags.length - 1}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}

                {posts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No blog posts found.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
            {/* Categories */}
            {categories.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/blog?category=${encodeURIComponent(category)}`}
                      className="block px-4 py-2 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Box */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-500 text-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-3">Try Vox AI Studio</h3>
              <p className="mb-4 text-purple-100">
                Transform your text into natural-sounding speech in seconds.
              </p>
              <Link
                href="/dashboard"
                className="block w-full bg-white text-purple-600 font-semibold py-3 px-4 rounded-lg hover:bg-purple-50 transition-colors text-center"
              >
                Start Free Trial
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
