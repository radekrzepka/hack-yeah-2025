import "@hackathon/ui/globals.css";

import { ThemeProvider } from "@hackathon/ui";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
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
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider>
            <a href="#main-content" className="skip-link">
              Przejdź do głównej zawartości
            </a>
            <main role="main" id="main-content">
              {children}
            </main>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
