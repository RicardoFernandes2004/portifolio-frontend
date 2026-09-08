import { notFound } from "next/navigation";
import { apiGetSafe } from "@/lib/api/server";
import type { Education } from "@/lib/api/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EducationForm } from "../../EducationForm";

export const dynamic = "force-dynamic";

export default async function EditEducationPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();
  const edu = await apiGetSafe<Education>(`/educations/${id}`, { auth: true });
  if (!edu) notFound();

  return (
    <div className="space-y-8 max-w-3xl">
      <AdminHeader
        eyebrow={`admin // educations/${id}`}
        title="Editar formação"
        description={`${edu.degree} · ${edu.school}`}
      />
      <EducationForm initial={edu} />
    </div>
  );
}
