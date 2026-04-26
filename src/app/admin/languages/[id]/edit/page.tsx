import { notFound } from "next/navigation";
import { apiGetSafe } from "@/lib/api/server";
import type { Language } from "@/lib/api/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { LanguageForm } from "../../LanguageForm";

export const dynamic = "force-dynamic";

export default async function EditLanguagePage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();
  const language = await apiGetSafe<Language>(`/languages/${id}`, { auth: true });
  if (!language) notFound();

  return (
    <div className="space-y-8 max-w-xl">
      <AdminHeader
        eyebrow={`admin // languages/${id}`}
        title="Editar idioma"
        description={language.name}
      />
      <LanguageForm initial={language} />
    </div>
  );
}
