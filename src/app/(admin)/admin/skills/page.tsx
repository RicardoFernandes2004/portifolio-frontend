import { AdminHeader } from "@/components/admin/AdminHeader";
import { SkillsTable } from "./SkillsTable";

export const metadata = { title: "Skills // admin" };

export default function SkillsPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <AdminHeader
        eyebrow="admin // skills"
        title="Skills"
        description="Stack pessoal exibida na página About e usada no PDF do currículo."
        actionHref="/admin/skills/new"
        actionLabel="nova skill"
      />
      <SkillsTable />
    </div>
  );
}
