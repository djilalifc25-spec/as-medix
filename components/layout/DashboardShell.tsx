'use client';

import React from 'react';
import { SidebarProvider, useSidebar } from './SidebarContext';
import { AppSidebar } from './AppSidebar';
import { AppTopNav } from './AppTopNav';
import { MobileBottomNav } from './MobileBottomNav';
import { User } from '@/types';

function DashboardShellInner({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-transparent flex flex-col transition-colors relative">
      {/* Soft ambient lighting spots */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 right-1/4 w-[600px] h-[600px] rounded-full bg-sky-500/10 blur-[130px]" />
        <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] rounded-full bg-pink-500/10 blur-[140px]" />
      </div>

      <AppSidebar />

      {/* Main Content Area properly offset from fixed sidebar on desktop */}
      <div
        className={`flex flex-col flex-1 pb-24 lg:pb-8 min-w-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        <AppTopNav user={user} />
        <main className="flex-1 px-4 py-2.5 sm:px-6 sm:py-6 lg:px-8 max-w-7xl w-full mx-auto transition-all">
          {children}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}

export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  return (
    <SidebarProvider>
      <DashboardShellInner user={user}>
        {children}
      </DashboardShellInner>
    </SidebarProvider>
  );
}
