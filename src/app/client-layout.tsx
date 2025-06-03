'use client';

import { ProComponentsProvider } from "@/lib/pro-components-config";

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProComponentsProvider>
      {children}
    </ProComponentsProvider>
  );
} 