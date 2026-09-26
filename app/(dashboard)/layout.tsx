import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { getCurrentUser } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <DashboardShell user={user}>
      {children}
    </DashboardShell>
  );
}
