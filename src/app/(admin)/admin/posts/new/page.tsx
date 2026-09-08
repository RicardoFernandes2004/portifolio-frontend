import { AdminHeader } from "@/components/admin/AdminHeader";
import { PostForm } from "../PostForm";

export const metadata = { title: "Novo post // admin" };

export default function NewPostPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      <AdminHeader eyebrow="admin // posts/new" title="Novo post" />
      <PostForm />
    </div>
  );
}
