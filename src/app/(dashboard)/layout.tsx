import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import Toaster from "@/components/ui/Toaster";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar role={session.user.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          name={session.user.name ?? "User"}
          email={session.user.email ?? ""}
          role={session.user.role}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}