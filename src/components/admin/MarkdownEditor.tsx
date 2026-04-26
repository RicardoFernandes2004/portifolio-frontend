"use client";

import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false, loading: () => <EditorSkeleton /> },
);

function EditorSkeleton() {
  return (
    <div className="border border-border bg-bg-deep/80 cyber-clip-sm h-[480px] flex items-center justify-center">
      <p className="font-mono text-xs text-neon-cyan terminal-prompt">
        loading editor...
      </p>
    </div>
  );
}

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
}

export function MarkdownEditor({
  value,
  onChange,
  height = 480,
}: MarkdownEditorProps) {
  return (
    <div data-color-mode="dark" className="cyber-md-editor">
      <MDEditor
        value={value}
        onChange={(v) => onChange(v ?? "")}
        height={height}
        preview="live"
      />
    </div>
  );
}
