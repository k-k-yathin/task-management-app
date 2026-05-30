import { useState, type ReactNode } from 'react';
import { Sidebar, MobileMenuButton } from './Sidebar';

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-slate-800 bg-slate-950/80 px-4 py-3 backdrop-blur-md lg:px-8">
          <MobileMenuButton onClick={() => setMobileOpen(true)} />
          <div className="flex-1" />
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
