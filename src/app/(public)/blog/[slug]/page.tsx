/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getPublishedBlogPosts } from "~/lib/blog";
import { Calendar, Clock, Tag, ArrowLeft, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getBlogPostBySlug(slug);

  if (!result.success || !result.data) {
    return {
      title: "Post Not Found",
    };
  }

  const post = result.data;

  return {
    title: post.metaTitle ?? `${post.title} | Vox AI Studio Blog`,
    description: post.metaDescription ?? post.excerpt,
    keywords: post.keywords?.join(", ") ?? "",
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.authorName],
      tags: post.tags,
    },
  };
}

export async function generateStaticParams() {
  const result = await getPublishedBlogPosts();

  // Add explicit check for result.data
  if (!result.success || !result.data) return [];

  return result.data.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params; // ✅ Await params first
  console.log("🌐 Page received slug:", slug);

  const result = await getBlogPostBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const post = result.data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-500 py-12 text-white">
        <div className="container mx-auto px-4">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-2 text-purple-100 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <div className="max-w-4xl">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/20 px-4 py-1.5 font-medium text-white backdrop-blur-sm">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-purple-100">
                <Clock className="h-4 w-4" />
                {post.readingTime}
              </span>
              <span className="flex items-center gap-1.5 text-purple-100">
                <Eye className="h-4 w-4" />
                {post.views} views
              </span>
            </div>

            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-purple-100">
              <span className="font-medium">{post.authorName}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt!).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl bg-white p-8 shadow-lg md:p-12">
            {/* Excerpt */}
            <p className="mb-8 border-b border-gray-200 pb-8 text-xl text-gray-600">
              {post.excerpt}
            </p>

            {/* Main Content */}
            <div className="prose prose-lg prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:my-6 prose-li:my-2 max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 border-t border-gray-200 pt-8">
                <div className="flex flex-wrap items-center gap-3">
                  <Tag className="h-5 w-5 text-gray-400" />
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="mt-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 p-8 text-center text-white shadow-lg">
            <h2 className="mb-4 text-3xl font-bold">
              Ready to Create Professional Voiceovers?
            </h2>
            <p className="mb-6 text-xl text-purple-100">
              Try Vox AI Studio and transform your text into natural-sounding
              speech in seconds.
            </p>
            <Link
              href="/dashboard"
              className="inline-block rounded-lg bg-white px-8 py-3 font-bold text-purple-600 transition-colors hover:bg-purple-50"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
