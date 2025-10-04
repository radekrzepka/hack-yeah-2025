"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
} from "@hackathon/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert as AlertCircle, Loader2, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useLogin } from "./_hooks/use-login";
import { handleAdminError } from "./_utils/handle-admin-error";
import { loginFormSchema, type LoginFormData } from "./schema";

export function LoginForm() {
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const router = useRouter();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      login: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: LoginFormData) => {
    setHasAttemptedSubmit(true);

    try {
      const result = await loginMutation.mutateAsync(data);

      toast.success("Zalogowano pomyślnie", {
        description: "Przekierowywanie do panelu administracyjnego...",
      });

      // Store JWT token in cookie for API calls and storage for persistence
      Cookies.set("auth-token", result.token, {
        expires: data.rememberMe ? 7 : undefined,
        sameSite: "strict",
      });

      if (data.rememberMe) {
        localStorage.setItem("adminToken", result.token);
        localStorage.setItem("adminLogin", data.login);
      } else {
        sessionStorage.setItem("adminToken", result.token);
        sessionStorage.setItem("adminLogin", data.login);
      }

      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1000);
    } catch (error) {
      const errorMessage = handleAdminError(error);
      toast.error("Błąd logowania", {
        description: errorMessage,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby="login-title"
      aria-describedby="login-description"
      role="form"
      className="w-full"
    >
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle
            className="text-foreground flex items-center gap-2"
            id="login-title"
          >
            <Lock className="text-primary h-5 w-5" aria-hidden="true" />
            Logowanie
          </CardTitle>
          <CardDescription id="login-description">
            Wypełnij poniższe pola, aby uzyskać dostęp do panelu
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error display */}
          {loginMutation.isError && (
            <div
              className="rounded-md border border-red-200 bg-red-50 p-4"
              role="alert"
              aria-live="assertive"
              aria-label="Komunikat o błędzie"
            >
              <div className="flex items-start gap-2">
                <AlertCircle
                  className="mt-0.5 h-4 w-4 text-red-500"
                  aria-hidden="true"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">
                    Błąd logowania
                  </p>
                  <p className="mt-1 text-xs text-red-700">
                    {handleAdminError(loginMutation.error)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form validation errors */}
          {hasAttemptedSubmit && Object.keys(errors).length > 0 && (
            <div
              className="rounded-md border border-amber-200 bg-amber-50 p-4"
              role="alert"
              aria-live="polite"
              aria-label="Lista błędów formularza"
            >
              <div className="flex items-start gap-2">
                <AlertCircle
                  className="mt-0.5 h-4 w-4 text-amber-600"
                  aria-hidden="true"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800">
                    Proszę poprawić błędy
                  </p>
                  <ul
                    className="mt-1 space-y-1 text-xs text-amber-700"
                    role="list"
                  >
                    {Object.entries(errors).map(([field, error]) => (
                      <li
                        key={field}
                        className="flex items-center gap-1"
                        role="listitem"
                      >
                        <span className="text-amber-600">•</span>
                        <span>{error?.message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Login field */}
            <div className="space-y-2">
              <Label htmlFor="login">Login</Label>
              <div className="relative">
                <User className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="login"
                  type="text"
                  placeholder="Wprowadź login"
                  autoComplete="username"
                  required
                  aria-required="true"
                  aria-invalid={errors.login ? "true" : "false"}
                  aria-describedby={errors.login ? "login-error" : undefined}
                  className={`pl-10 ${
                    errors.login ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  {...register("login")}
                />
              </div>
              {errors.login && touchedFields.login && (
                <p
                  id="login-error"
                  className="mt-1 text-xs text-red-600"
                  role="alert"
                >
                  {errors.login.message}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <div className="relative">
                <Lock className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Wprowadź hasło"
                  autoComplete="current-password"
                  required
                  aria-required="true"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  className={`pl-10 ${
                    errors.password ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  {...register("password")}
                />
              </div>
              {errors.password && touchedFields.password && (
                <p
                  id="password-error"
                  className="mt-1 text-xs text-red-600"
                  role="alert"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setValue("rememberMe", checked as boolean)
                  }
                  aria-label="Zapamiętaj mnie na tym urządzeniu"
                />
                <Label
                  htmlFor="rememberMe"
                  className="cursor-pointer text-sm font-normal"
                >
                  Zapamiętaj mnie
                </Label>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || loginMutation.isPending}
            aria-busy={isSubmitting || loginMutation.isPending}
          >
            {isSubmitting || loginMutation.isPending ? (
              <>
                <Loader2
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
                <span>Logowanie...</span>
              </>
            ) : (
              <span>Zaloguj się</span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
