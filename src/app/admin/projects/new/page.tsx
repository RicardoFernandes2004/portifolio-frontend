import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProjectForm } from "../ProjectForm";

export const metadata = { title: "Novo projeto // admin" };

export default function NewProjectPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <AdminHeader eyebrow="admin // projects/new" title="Novo projeto" />
      <ProjectForm />
    </div>
  );
}
