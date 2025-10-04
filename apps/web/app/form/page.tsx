import { Suspense } from "react";
import { FormClient } from "./form-client";

function FormLoadingFallback() {
  return (
    <div className="bg-muted/20 flex min-h-screen items-center justify-center px-4 py-12">
      <div className="animate-fade-in w-full max-w-4xl">
        <header className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="bg-primary text-primary-foreground px-6 py-2 text-2xl font-bold">
              ZUS
            </div>
          </div>
          <h1 className="text-foreground mb-3 text-4xl font-bold">
            Kalkulator Twojej przyszłej emerytury
          </h1>
          <p className="text-muted-foreground text-lg">
            Podaj dane, aby przygotować prognozę swojej przyszłej emerytury.
          </p>
        </header>

        <section aria-labelledby="form-heading">
          <h2 id="form-heading" className="sr-only">
            Formularz prognozy emerytalnej
          </h2>
          <div className="bg-card rounded-lg border p-8 shadow-sm">
            <div className="flex items-center justify-center">
              <div className="text-muted-foreground text-lg">
                Ładowanie formularza...
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Form() {
  return (
    <div className="bg-muted/20 flex min-h-screen items-center justify-center px-4 py-12">
      <div className="animate-fade-in w-full max-w-4xl">
        <header className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="bg-primary text-primary-foreground px-6 py-2 text-2xl font-bold">
              ZUS
            </div>
          </div>
          <h1 className="text-foreground mb-3 text-4xl font-bold">
            Kalkulator Twojej przyszłej emerytury
          </h1>
          <p className="text-muted-foreground text-lg">
            Podaj dane, aby przygotować prognozę swojej przyszłej emerytury.
          </p>
        </header>

        <section aria-labelledby="form-heading">
          <h2 id="form-heading" className="sr-only">
            Formularz prognozy emerytalnej
          </h2>
          <Suspense fallback={<FormLoadingFallback />}>
            <FormClient />
          </Suspense>
        </section>
      </div>
    </div>
  );
}

export default Form;
