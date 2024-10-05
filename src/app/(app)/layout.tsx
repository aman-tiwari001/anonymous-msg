import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../../app/globals.css'
import AuthProvider from '../../context/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Myst!Q - Ask questions anonymously',
	description: 'Fullstack Next.js app with TypeScript, NextAuth.js and Zod',
};

interface RootLayoutProps {
	children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang='en'>
			<AuthProvider>
				<body className={`${inter.className} bg-secondary`}>
					<Navbar />
					{children}
					<Toaster />
				</body>
			</AuthProvider>
		</html>
	);
}
