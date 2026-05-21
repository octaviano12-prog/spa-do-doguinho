import {
  Bell,
  Search,
  PawPrint
} from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="h-24 px-8 flex items-center justify-between border-b border-white/20 bg-white/60 backdrop-blur-xl">

      <div>
        <h1 className="text-2xl font-black text-gray-900">
          SPA do Doguinho
        </h1>

        <p className="text-gray-500 text-sm">
          Painel administrativo premium
        </p>
      </div>

      <div className="flex items-center gap-4">

        <div className="hidden md:flex items-center gap-3 bg-white rounded-2xl px-4 h-14 border border-gray-200 shadow-sm">
          <Search
            size={18}
            className="text-gray-400"
          />

          <input
            placeholder="Pesquisar..."
            className="outline-none bg-transparent"
          />
        </div>

        <button className="w-14 h-14 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:scale-105 transition">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl px-5 h-14 shadow-xl">
          <PawPrint size={20} />

          <div className="font-bold">
            Admin
          </div>
        </div>

      </div>
    </header>
  );
}