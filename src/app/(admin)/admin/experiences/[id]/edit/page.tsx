import { notFound } from "next/navigation";
import { apiGetSafe } from "@/lib/api/server";
import type { Experience } from "@/lib/api/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ExperienceForm } from "../../ExperienceForm";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();
  const exp = await apiGetSafe<Experience>(`/experiences/${id}`, {
    auth: true,
  });
  if (!exp) notFound();

  return (
    <div className="space-y-8 max-w-3xl">
      <AdminHeader
        eyebrow={`admin // experiences/${id}`}
        title="Editar experiência"
        description={`${exp.position} @ ${exp.company}`}
      />
      <ExperienceForm initial={exp} />
    </div>
  );
}
