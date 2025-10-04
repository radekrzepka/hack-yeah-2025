import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <div className="bg-muted/20 flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="bg-primary text-primary-foreground px-6 py-2 text-2xl font-bold">
              ZUS
            </div>
          </div>
          <h1 className="text-foreground mb-3 text-3xl font-bold">
            Panel Administratora
          </h1>
          <p className="text-muted-foreground text-lg">
            Zaloguj się do panelu administracyjnego
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
