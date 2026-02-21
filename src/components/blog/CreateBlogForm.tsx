"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBlogPost } from "~/lib/blog";
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface CreateBlogFormProps {
  userName: string;
  userEmail: string;
}

export default function CreateBlogForm({
  userName,
  userEmail,
}: CreateBlogFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "How-To Guide",
    tags: "",
    authorName: userName || "Vox AI Team",
    readingTime: "5 min read",
    featured: false,
    status: "PUBLISHED" as "DRAFT" | "PUBLISHED",
  });

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      const result = await createBlogPost(formDataToSend);

      if (result.success) {
        router.push("/blog");
        router.refresh();
      } else {
        setError(result.error ?? "Failed to create blog post");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">
            Create New Blog Post
          </h1>
          <p className="mt-2 text-gray-600">
            Write and publish a new article for your blog
            <span className="ml-2 text-purple-600">
              • Logged in as: {userName || userEmail}
            </span>
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-transparent focus:ring-2 focus:ring-purple-500"
                placeholder="Enter blog post title..."
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Slug (URL) *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm focus:border-transparent focus:ring-2 focus:ring-purple-500"
                placeholder="blog-post-url"
              />
              <p className="mt-1 text-sm text-gray-500">
                URL: /blog/{formData.slug || "your-slug"}
              </p>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Excerpt (Summary) *
              </label>
              <textarea
                required
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                placeholder="Write a brief summary of your post..."
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.excerpt.length} characters (recommended: 120-160)
              </p>
            </div>

            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                >
                  <option value="How-To Guide">How-To Guide</option>
                  <option value="Educational">Educational</option>
                  <option value="Industry Insights">Industry Insights</option>
                  <option value="Use Cases">Use Cases</option>
                  <option value="Tutorial">Tutorial</option>
                  <option value="News">News</option>
                  <option value="Case Study">Case Study</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Tags (comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder="AI Voice, Tutorial, TTS"
                />
              </div>
            </div>

            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Author Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.authorName}
                  onChange={(e) =>
                    setFormData({ ...formData, authorName: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Reading Time *
                </label>
                <input
                  type="text"
                  required
                  value={formData.readingTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      readingTime: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder="5 min read"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700">
                  Content (Markdown) *
                </label>
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
                >
                  <Eye className="h-4 w-4" />
                  {previewMode ? "Edit" : "Preview"}
                </button>
              </div>

              {!previewMode ? (
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={20}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder="# Your Blog Post Title&#10;&#10;Write your content here using Markdown...&#10;&#10;## Section 1&#10;Your content here...&#10;&#10;## Section 2&#10;More content..."
                />
              ) : (
                <div className="prose prose-lg prose-headings:font-bold prose-headings:text-gray-900 prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-2 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4 prose-li:my-1 prose-strong:text-gray-900 prose-a:text-purple-600 hover:prose-a:underline prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-purple-700 min-h-[500px] w-full max-w-none rounded-lg border border-gray-300 bg-white px-6 py-4">
                  {formData.content ? (
                    <ReactMarkdown>{formData.content}</ReactMarkdown>
                  ) : (
                    <p className="text-gray-400 italic">
                      Nothing to preview yet. Start writing in Edit mode.
                    </p>
                  )}
                </div>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Use Markdown formatting.{" "}
                {formData.content.split(" ").filter((w) => w).length} words
              </p>
            </div>

            <div className="mb-6 flex flex-wrap gap-6 rounded-lg bg-gray-50 p-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Featured Post (show on homepage)
                </span>
              </label>

              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">
                  Status:
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "DRAFT" | "PUBLISHED",
                    })
                  }
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-transparent focus:ring-2 focus:ring-purple-500"
                >
                  <option value="DRAFT">Draft (not visible)</option>
                  <option value="PUBLISHED">Published (visible)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-3 font-semibold text-white transition-all hover:from-purple-700 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Create Blog Post
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-3 font-bold text-blue-900">Markdown Quick Guide</h3>
          <div className="grid gap-4 text-sm text-blue-800 md:grid-cols-2">
            <div className="space-y-1">
              <div className="rounded bg-blue-100 px-2 py-1 font-mono">
                # Heading 1
              </div>
              <div className="rounded bg-blue-100 px-2 py-1 font-mono">
                ## Heading 2
              </div>
              <div className="rounded bg-blue-100 px-2 py-1 font-mono">
                **bold text**
              </div>
              <div className="rounded bg-blue-100 px-2 py-1 font-mono">
                *italic text*
              </div>
            </div>
            <div className="space-y-1">
              <div className="rounded bg-blue-100 px-2 py-1 font-mono">
                - List item
              </div>
              <div className="rounded bg-blue-100 px-2 py-1 font-mono">
                1. Numbered item
              </div>
              <div className="rounded bg-blue-100 px-2 py-1 font-mono">
                [link](url)
              </div>
              <div className="rounded bg-blue-100 px-2 py-1 font-mono">
                `code`
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
