import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SkyTrack | Real-time Flight Tracker',
  description: 'Real-time flight tracking application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        {children}
        <footer className="app-footer">
          <p className="footer-text">
            DESIGNED & DEVELOPED BY <span className="footer-name">EBRAR HOSGUL</span>
          </p>
        </footer>
      </body>
    </html>
  );
}
