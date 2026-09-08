import { AdminHeader } from "@/components/admin/AdminHeader";
import { SecurityPanel } from "./SecurityPanel";

export const dynamic = "force-dynamic";
export const metadata = { title: "Segurança // admin" };

export default function SecurityPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <AdminHeader
        eyebrow="admin // security"
        title="Segurança"
        description="Verificação em duas etapas do painel. Com ela ativa, o login e a redefinição de senha passam a exigir um código além da senha."
      />
      <SecurityPanel />
    </div>
  );
}
