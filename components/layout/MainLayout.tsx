"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import AIAssistant from "@/components/ai/AIAssistant";

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden grid-bg" style={{ background: "var(--bg-primary)" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <AIAssistant />
    </div>
  );
}
