import { AdminHeader } from "@/components/admin/AdminHeader";
import { CategoriesManager } from "./CategoriesManager";

export const metadata = { title: "Categorias // admin" };

export default function CategoriesPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <AdminHeader
        eyebrow="admin // categories"
        title="Categories"
        description="Categorias usadas para classificar posts do blog."
      />
      <CategoriesManager />
    </div>
  );
}
