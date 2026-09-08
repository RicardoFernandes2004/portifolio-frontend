import { apiGetSafe } from "@/lib/api/server";
import type { ResumeHeader } from "@/lib/api/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ResumeForm } from "./ResumeForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Resume header // admin" };

export default async function ResumePage() {
  const header = await apiGetSafe<ResumeHeader>("/resume/header");
  return (
    <div className="space-y-8 max-w-3xl">
      <AdminHeader
        eyebrow="admin // resume header"
        title="Resume header"
        description="Identidade exibida na home, no /about e impressa no PDF do currículo."
      />
      <ResumeForm initial={header ?? undefined} />
    </div>
  );
}
