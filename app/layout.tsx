import './globals.css';
import { ReactNode } from 'react';
export const metadata = { title: 'BananaAI' };
export default function RootLayout({ children }: { children: ReactNode }) {
  return (<html lang="en"><body className="bg-slate-50"><div className="max-w-6xl mx-auto p-6">{children}</div></body></html>);
}
