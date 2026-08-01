import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 transition-colors dark:bg-slate-950">
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        <Header onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}