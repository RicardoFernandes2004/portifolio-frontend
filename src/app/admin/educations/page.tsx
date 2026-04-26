import { AdminHeader } from "@/components/admin/AdminHeader";
import { EducationsTable } from "./EducationsTable";

export const metadata = { title: "Educations // admin" };

export default function EducationsPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <AdminHeader
        eyebrow="admin // educations"
        title="Educations"
        description="Formação acadêmica usada no About e no PDF do currículo."
        actionHref="/admin/educations/new"
        actionLabel="nova formação"
      />
      <EducationsTable />
    </div>
  );
}
