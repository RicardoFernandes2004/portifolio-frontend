import { notFound } from "next/navigation";
import { apiGetSafe } from "@/lib/api/server";
import type { Skill } from "@/lib/api/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SkillForm } from "../../SkillForm";

export const dynamic = "force-dynamic";

export default async function EditSkillPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();
  const skill = await apiGetSafe<Skill>(`/skills/${id}`, { auth: true });
  if (!skill) notFound();

  return (
    <div className="space-y-8 max-w-2xl">
      <AdminHeader
        eyebrow={`admin // skills/${id}`}
        title="Editar skill"
        description={skill.name}
      />
      <SkillForm initial={skill} />
    </div>
  );
}
