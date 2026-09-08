import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProjectsTable } from "./ProjectsTable";

export const metadata = { title: "Projects // admin" };

export default function ProjectsAdminPage() {
  return (
    <div className="space-y-8 max-w-7xl">
      <AdminHeader
        eyebrow="admin // projects"
        title="Projects"
        description="Projetos exibidos publicamente em /projects."
        actionHref="/admin/projects/new"
        actionLabel="novo projeto"
      />
      <ProjectsTable />
    </div>
  );
}
