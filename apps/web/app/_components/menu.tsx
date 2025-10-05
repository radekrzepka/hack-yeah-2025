"use client";

import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@hackathon/ui";
import { Menu as MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Menu() {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex w-full items-center justify-between space-x-8">
          <Link href="/" className="text-primary text-xl font-bold">
            <Image
              src="/logo_zus_darker_with_text.svg"
              alt="ZUSometr"
              width={150}
              height={40}
              className="h-8"
            />
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
              ZUSometr
            </Link>
          </nav>
        </div>

        {/* Mobile hamburger menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Otwórz menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <SheetHeader>
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col space-y-4">
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
                ZUSometr
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
