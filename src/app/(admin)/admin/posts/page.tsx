import { AdminHeader } from "@/components/admin/AdminHeader";
import { PostsTable } from "./PostsTable";

export const metadata = { title: "Posts // admin" };

export default function PostsPage() {
  return (
    <div className="space-y-8 max-w-7xl">
      <AdminHeader
        eyebrow="admin // posts"
        title="Posts"
        description="Gerencie posts publicados e drafts. Apenas posts com publishedAt aparecem em /blog."
        actionHref="/admin/posts/new"
        actionLabel="novo post"
      />
      <PostsTable />
    </div>
  );
}
