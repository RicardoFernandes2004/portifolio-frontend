import { AdminHeader } from "@/components/admin/AdminHeader";
import { EducationForm } from "../EducationForm";

export const metadata = { title: "Nova formação // admin" };

export default function NewEducationPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <AdminHeader eyebrow="admin // educations/new" title="Nova formação" />
      <EducationForm />
    </div>
  );
}
