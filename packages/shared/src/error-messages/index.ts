export const ErrorMessages = {
  // Auth related errors
  AUTH: {
    EMAIL_ALREADY_EXISTS: "Ten adres email jest już zarejestrowany w systemie",
    INVALID_CREDENTIALS: "Niepoprawny email lub hasło",
    EMAIL_NOT_VERIFIED:
      "Email nie został zweryfikowany. Sprawdź swoją skrzynkę oraz folder spam",
    USER_CREATION_FAILED: "Nie udało się utworzyć użytkownika",
    ORGANIZATION_CREATION_FAILED: "Nie udało się utworzyć organizacji",
    CHECKOUT_URL_CREATION_FAILED: "Nie udało się utworzyć linku do płatności",
    INVALID_RESET_TOKEN: "Nieprawidłowy token resetowania hasła",
    RESET_TOKEN_EXPIRED: "Token resetowania hasła wygasł",
    INVALID_VERIFICATION_TOKEN: "Nieprawidłowy lub wygasły token weryfikacji",
    INVALID_PAGE_TOKEN: "Nieprawidłowy token weryfikacji",
    USER_ALREADY_VERIFIED: "Twoje konto jest już zweryfikowane",
    EMAIL_VERIFICATION_ALREADY_SENT: "Email weryfikacyjny został już wysłany",
  },

  // Invitations related errors
  INVITATIONS: {
    INVITATION_NOT_FOUND: "Zaproszenie nie zostało znalezione",
    INVITATION_EXPIRED: "Zaproszenie wygasło",
    INVITATION_ALREADY_EXISTS:
      "Oczekujące zaproszenie dla tego adresu email już istnieje",
    USER_ALREADY_EXISTS: "Użytkownik z tym adresem email już istnieje",
    INVITATION_CREATION_FAILED: "Nie udało się utworzyć zaproszenia",
    USER_UPDATE_FAILED: "Nie udało się zaktualizować danych użytkownika",
  },

  // Email related errors
  EMAIL: {
    SEND_FAILED: "Nie udało się wysłać wiadomości email",
  },

  // Stripe related errors
  STRIPE: {
    WEBHOOK_SIGNATURE_VERIFICATION_FAILED:
      "Weryfikacja podpisu webhook nie powiodła się",
    BODY_PARSING_ERROR: "Błąd parsowania treści żądania",
    WEBHOOK_PROCESSING_ERROR: "Błąd podczas przetwarzania webhook",
  },

  // Generic errors
  GENERIC: {
    INVALID_ORGANIZATION_ROLE: "Nieprawidłowa rola w organizacji",
    OPERATION_FAILED: "Operacja nie powiodła się",
    UNAUTHORIZED_ACCESS: "Brak uprawnień do wykonania tej operacji",
    RESOURCE_NOT_FOUND: "Zasób nie został znaleziony",
  },

  // Form validation errors
  VALIDATION: {
    INVALID_EMAIL: "Podaj poprawny adres e-mail",
    FIELD_REQUIRED: "To pole jest wymagane",
    PASSWORD_TOO_SHORT: "Hasło musi mieć co najmniej 8 znaków",
    PASSWORDS_DO_NOT_MATCH: "Hasła nie są identyczne",
    FIELD_TOO_LONG: "Pole jest za długie",
    FIELD_TOO_SHORT: "Pole jest za krótkie",
  },

  // General UI messages
  UI: {
    UNKNOWN_ERROR: "Wystąpił nieoczekiwany błąd",
    NETWORK_ERROR: "Błąd połączenia sieciowego",
    SERVER_ERROR: "Błąd serwera",
  },
} as const;

export function defaultMaxErrorMessage(name: string, length: number) {
  return `Długość ${name} nie powinna przekraczać ${length} znaków`;
}

export function defaultMinLengthErrorMessage(name: string, length: number) {
  return `${name} musi mieć co najmniej ${length} znaków`;
}

export function defaultMinErrorMessage(name: string) {
  return `Podaj ${name}`;
}

export function defaultMaxValueMessage(name: string, length: number) {
  return `Długość ${name} nie powinna przekraczać ${length} znaków`;
}

export function defaultMinValueMessage(name: string) {
  return `Podaj ${name}`;
}
