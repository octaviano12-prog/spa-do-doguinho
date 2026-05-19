import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {open && <div className="overlay" onClick={() => setOpen(false)} />}
      <div className="main">
        <Header onMenuClick={() => setOpen(true)} />
        <main className="page">{children}</main>
      </div>
    </div>
  );
}
