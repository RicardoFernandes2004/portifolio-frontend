import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

import "highlight.js/styles/atom-one-dark.css";

export function MarkdownView({ source }: { source: string }) {
  return (
    <article className="prose-cyber max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
      >
        {source}
      </ReactMarkdown>
    </article>
  );
}
