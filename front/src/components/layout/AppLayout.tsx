import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 transition-colors dark:bg-slate-950">
      {/* Sidebar (Contrôlée pour desktop & mobile) */}
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Zone Principale */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header avec trigger pour ouvrir la sidebar sur mobile */}
        <Header onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        {/* Zone de contenu défilante */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}