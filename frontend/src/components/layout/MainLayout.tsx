import type React from 'react';
import Sidebar from './Sidebar';

interface Props {
  activePage: string;
  onNavigate: (x: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}
export default function MainLayout({
  activePage,
  onNavigate,
  onLogout,
  children,
}: Props) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="min-w-0 flex-1 p-8">{children}</main>
    </div>
  );
}
