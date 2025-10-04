import { FormClient } from "./form-client";

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
            Symulator Twojej przyszłej emerytury
          </h1>
          <p className="text-muted-foreground text-lg">
            Podaj dane, aby przygotować prognozę swojej przyszłej emerytury.
          </p>
        </header>

        <section aria-labelledby="form-heading">
          <h2 id="form-heading" className="sr-only">
            Formularz prognozy emerytalnej
          </h2>
          <FormClient />
        </section>
      </div>
    </div>
  );
}

export default Form;
