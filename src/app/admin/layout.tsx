import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { MobileNav } from "@/components/admin/MobileNav";
import { Header } from "@/components/site/Header";
import { ToastProvider } from "@/components/admin/Toast";
import { isLoggedInServer } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isLoggedInServer()) {
    redirect("/login?from=/admin");
  }
  return (
    <ToastProvider>
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <MobileNav />
          <main className="px-4 md:px-8 py-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
