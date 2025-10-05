import "@hackathon/ui/globals.css";

import { ThemeProvider } from "@hackathon/ui";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Footer } from "./_components/footer";
import { Menu } from "./_components/menu";
import { QueryClientProvider } from "./_providers/query-client-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZUS - Symulator przyszłej emerytury",
  description:
    "Kalkulator prognozy emerytalnej ZUS - sprawdź orientacyjną wysokość swojej przyszłej emerytury",
  keywords: [
    "emerytura",
    "ZUS",
    "kalkulator",
    "prognoza",
    "pensja",
    "świadczenia",
  ],
  authors: [{ name: "ZUS" }],
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryClientProvider>
            <div className="print:hidden">
              <Menu />
            </div>
            <a href="#main-content" className="skip-link print:hidden">
              Przejdź do głównej zawartości
            </a>
            <main role="main" id="main-content" className="flex-1">
              {children}
            </main>
            <div className="print:hidden">
              <Footer />
            </div>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
