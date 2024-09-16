import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NextApp',
  description: 'Fullstack Next.js app with TypeScript, NextAuth.js and Zod',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" >
      <AuthProvider>
        <body className={`${inter.className} bg-secondary`}>
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}

