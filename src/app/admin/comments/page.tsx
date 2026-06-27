import { AdminHeader } from "@/components/admin/AdminHeader";
import { CommentsModerator } from "./CommentsModerator";

export const metadata = { title: "Comentários // admin" };

export default function CommentsPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <AdminHeader
        eyebrow="admin // comments"
        title="Moderação"
        description="Comentários retidos (bateram na blacklist) aguardando aprovação. Aprove para publicar ou exclua."
      />
      <CommentsModerator />
    </div>
  );
}
