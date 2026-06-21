import type {Metadata, Viewport} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SafeVideo',
  description: 'Download videos and media from multiple platforms quickly.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SafeVideo"
  }
};

export const viewport: Viewport = {
  themeColor: '#09090b', // zinc-950
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 font-sans text-zinc-50 min-h-screen antialiased selection:bg-blue-500/30 selection:text-blue-100`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
