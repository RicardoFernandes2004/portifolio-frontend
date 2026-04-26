import { AdminHeader } from "@/components/admin/AdminHeader";
import { SkillForm } from "../SkillForm";

export const metadata = { title: "Nova skill // admin" };

export default function NewSkillPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <AdminHeader eyebrow="admin // skills/new" title="Nova skill" />
      <SkillForm />
    </div>
  );
}
