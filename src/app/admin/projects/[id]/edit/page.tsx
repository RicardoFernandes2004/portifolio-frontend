import { notFound } from "next/navigation";
import { apiGetSafe } from "@/lib/api/server";
import type { Project } from "@/lib/api/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProjectForm } from "../../ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();
  const project = await apiGetSafe<Project>(`/projects/${id}`);
  if (!project) notFound();

  return (
    <div className="space-y-8 max-w-4xl">
      <AdminHeader
        eyebrow={`admin // projects/${id}`}
        title="Editar projeto"
        description={project.title}
      />
      <ProjectForm initial={project} />
    </div>
  );
}
