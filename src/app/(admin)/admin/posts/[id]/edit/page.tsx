import { notFound } from "next/navigation";
import { apiGetSafe } from "@/lib/api/server";
import type { Post } from "@/lib/api/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PostForm } from "../../PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();
  const post = await apiGetSafe<Post>(`/posts/${id}`, { auth: true });
  if (!post) notFound();

  return (
    <div className="space-y-8 max-w-5xl">
      <AdminHeader
        eyebrow={`admin // posts/${id}`}
        title="Editar post"
        description={post.title}
      />
      <PostForm initial={post} />
    </div>
  );
}
