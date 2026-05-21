import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import PageTransition from "../ui/PageTransition";

export default function AdminLayout({
  children
}) {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader />

        <PageTransition>
          <main className="p-8">
            {children}
          </main>
        </PageTransition>
      </div>
    </div>
  );
}
