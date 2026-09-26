import React from "react";

// Full-screen session group - inherits ThemeProvider & FacultyProvider from root layout
// No DashboardShell (no sidebar, no topnav)
export default function SessionGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
