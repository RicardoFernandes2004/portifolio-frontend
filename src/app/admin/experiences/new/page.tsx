import { AdminHeader } from "@/components/admin/AdminHeader";
import { ExperienceForm } from "../ExperienceForm";

export const metadata = { title: "Nova experiência // admin" };

export default function NewExperiencePage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <AdminHeader
        eyebrow="admin // experiences/new"
        title="Nova experiência"
      />
      <ExperienceForm />
    </div>
  );
}
