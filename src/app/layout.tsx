import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap'
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap'
})

export const metadata: Metadata = {
  title: "The Cleanup Crew | Canada's #1 Premium Window & Exterior Cleaning",
  description:
    "Canada's top-rated professional window cleaning, eavestrough cleaning, and commercial exterior maintenance. WSIB compliant, fully insured, eco-friendly. Serving the Greater Toronto Area and beyond.",
  keywords: [
    "window cleaning Canada",
    "window cleaning Toronto",
    "eavestrough cleaning",
    "commercial cleaning Canada",
    "professional cleaning services",
    "eco-friendly window cleaning",
    "gutter cleaning Toronto",
    "carpet cleaning Canada",
  ],
  openGraph: {
    title: "The Cleanup Crew | Canada's #1 Premium Window & Exterior Cleaning",
    description:
      "Trusted by 15,000+ Canadian homeowners. Professional window cleaning with eco-friendly pure-water technology.",
    url: "https://thecleanupcrew.ca",
    siteName: "The Cleanup Crew",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${jakarta.variable} ${inter.variable} ${playfair.variable} font-sans bg-black text-white antialiased min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
