import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { GlobalSearchDialog } from '@/components/search/GlobalSearchDialog';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

export function MainLayout() {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <GlobalSearchDialog />
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
