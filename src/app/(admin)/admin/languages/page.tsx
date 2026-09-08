import { AdminHeader } from "@/components/admin/AdminHeader";
import { LanguagesTable } from "./LanguagesTable";

export const metadata = { title: "Languages // admin" };

export default function LanguagesPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <AdminHeader
        eyebrow="admin // languages"
        title="Languages"
        description="Idiomas exibidos no About e no PDF do currículo."
        actionHref="/admin/languages/new"
        actionLabel="novo idioma"
      />
      <LanguagesTable />
    </div>
  );
}
