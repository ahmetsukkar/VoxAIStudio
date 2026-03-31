"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  content: string;
};

const markdownComponents: Components = {
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-purple-50 text-gray-700">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-900">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-200 px-4 py-2 text-gray-700">
      {children}
    </td>
  ),
  tr: ({ children }) => <tr className="even:bg-gray-50">{children}</tr>,
};

export default function BlogContent({ content }: Props) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {content}
    </ReactMarkdown>
  );
}
