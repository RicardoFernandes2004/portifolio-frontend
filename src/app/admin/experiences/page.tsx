import { AdminHeader } from "@/components/admin/AdminHeader";
import { ExperiencesTable } from "./ExperiencesTable";

export const metadata = { title: "Experiences // admin" };

export default function ExperiencesPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <AdminHeader
        eyebrow="admin // experiences"
        title="Experiences"
        description="Histórico profissional usado em /experiences e no PDF do currículo."
        actionHref="/admin/experiences/new"
        actionLabel="nova experiência"
      />
      <ExperiencesTable />
    </div>
  );
}
