import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBlogPostBySlug,
  getAdjacentPosts,
  getRelatedPosts,
} from "~/lib/blog";
import {
  Calendar,
  Clock,
  Tag,
  ArrowLeft,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import ShareButtons from "~/components/blog/ShareButtons";
import AuthCTA from "~/components/auth-cta";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getBlogPostBySlug(slug);

  if (!result.success || !result.data) {
    return { title: "Post Not Found" };
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
      images: ["/images/og-image.png"],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const result = await getBlogPostBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const post = result.data;

  const [adjacentResult, relatedResult] = await Promise.all([
    getAdjacentPosts(slug, post.publishedAt!),
    getRelatedPosts(slug, post.category),
  ]);

  const { prevPost, nextPost } = adjacentResult.data ?? {
    prevPost: null,
    nextPost: null,
  };
  const relatedPosts = relatedResult.data ?? [];

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
            <div className="prose prose-lg prose-headings:font-bold prose-headings:text-gray-900 prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-2 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:my-4 prose-li:my-1 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-purple-700 prose-blockquote:border-l-4 prose-blockquote:border-purple-400 prose-blockquote:bg-purple-50 prose-blockquote:py-1 max-w-none">
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

            {/* Share Buttons */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <p className="mb-3 text-sm font-semibold tracking-wide text-gray-600 uppercase">
                Share this article
              </p>
              <ShareButtons title={post.title} slug={post.slug} />
            </div>
          </div>

          {/* Prev / Next Navigation */}
          {(prevPost ?? nextPost) && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="group flex flex-col gap-2 rounded-xl bg-white p-6 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <span className="flex items-center gap-1 text-sm font-medium text-purple-500">
                    <ChevronLeft className="h-4 w-4" />
                    Previous Article
                  </span>
                  <span className="line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-purple-600">
                    {prevPost.title}
                  </span>
                  <span className="text-sm text-gray-500">
                    {prevPost.readingTime}
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group flex flex-col gap-2 rounded-xl bg-white p-6 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg sm:text-right"
                >
                  <span className="flex items-center gap-1 text-sm font-medium text-purple-500 sm:justify-end">
                    Next Article
                    <ChevronRight className="h-4 w-4" />
                  </span>
                  <span className="line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-purple-600">
                    {nextPost.title}
                  </span>
                  <span className="text-sm text-gray-500">
                    {nextPost.readingTime}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Related Articles
              </h2>
              <div className="grid gap-6 sm:grid-cols-3">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group flex flex-col gap-3 rounded-xl bg-white p-6 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span className="text-xs font-semibold tracking-wide text-purple-500 uppercase">
                      {related.category}
                    </span>
                    <span className="line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-purple-600">
                      {related.title}
                    </span>
                    <p className="line-clamp-2 text-sm text-gray-500">
                      {related.excerpt}
                    </p>
                    <span className="mt-auto text-xs text-gray-400">
                      {related.readingTime}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 p-8 text-center text-white shadow-lg">
            <h2 className="mb-4 text-3xl font-bold">
              Ready to Create Professional Voiceovers?
            </h2>
            <p className="mb-6 text-xl text-purple-100">
              Try Vox AI Studio and transform your text into natural-sounding
              speech in seconds.
            </p>
            <AuthCTA
              label="Start Free Trial"
              icon="AudioWaveform"
              size="lg"
              className="bg-white px-8 font-bold text-purple-600 hover:bg-purple-50"
            />
          </div>
        </div>
      </article>
    </div>
  );
}
