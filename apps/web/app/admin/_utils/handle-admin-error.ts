import { ApiError } from "@/_utils/fetch/shared";

export function handleAdminError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return "Nieprawidłowy login lub hasło";
      case 403:
        return "Brak uprawnień do tej operacji";
      case 404:
        return "Nie znaleziono zasobu";
      case 422:
        return "Nieprawidłowe dane wejściowe";
      case 429:
        return "Zbyt wiele prób. Spróbuj ponownie później";
      case 500:
        return "Błąd serwera. Spróbuj ponownie później";
      default:
        return error.message || "Wystąpił nieoczekiwany błąd";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Wystąpił nieoczekiwany błąd";
}
