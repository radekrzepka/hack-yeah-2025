import { ModeToggle } from "@hackathon/ui";

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Test Table Management</h1>
          <ModeToggle />
        </div>
      </header>
      <main className="container mx-auto px-4">{children}</main>
    </div>
  );
}
