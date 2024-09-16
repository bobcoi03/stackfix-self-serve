import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stackfix Business Software Self Serve Prototype Upload",
  description: "Upload your business software self serve prototype to Stackfix. Get started in minutes!",
  openGraph: {
    title: "Stackfix Business Software Self Serve Prototype Upload",
    description: "Upload your business software self serve prototype to Stackfix.",
    siteName: "Stackfix",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
      <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS!} />
    </html>
  );
}