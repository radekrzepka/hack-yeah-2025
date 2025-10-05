import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">ZUSometr</h3>
            <p className="text-muted-foreground text-sm">
              Kalkulator prognozy emerytalnej ZUS - sprawdź orientacyjną
              wysokość swojej przyszłej emerytury.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Nawigacja</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Strona główna
                </Link>
              </li>
              <li>
                <Link
                  href="/form"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  ZUSometr
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Informacje</h4>
            <p className="text-muted-foreground text-sm">
              Wszystkie obliczenia mają charakter orientacyjny i nie stanowią
              gwarancji przyszłej wysokości emerytury.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 ZUSometr. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
}
