import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-950 via-emerald-950 to-slate-950">
      <AdminSidebar />

      <div className="flex-1 min-w-0">
        <AdminHeader />

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
