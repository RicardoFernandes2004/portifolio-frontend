import { AdminHeader } from "@/components/admin/AdminHeader";
import { LanguageForm } from "../LanguageForm";

export const metadata = { title: "Novo idioma // admin" };

export default function NewLanguagePage() {
  return (
    <div className="space-y-8 max-w-xl">
      <AdminHeader eyebrow="admin // languages/new" title="Novo idioma" />
      <LanguageForm />
    </div>
  );
}
