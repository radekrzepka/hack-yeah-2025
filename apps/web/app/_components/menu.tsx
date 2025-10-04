import { ModeToggle } from "@hackathon/ui";
import Link from "next/link";

export function Menu() {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-primary text-xl font-bold">
            ZUS Symulator
          </Link>
          <nav className="hidden space-x-6 md:flex">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Strona główna
            </Link>
            <Link
              href="/form"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Kalkulator emerytury
            </Link>
            <Link
              href="/test"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Test Table
            </Link>
          </nav>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}
