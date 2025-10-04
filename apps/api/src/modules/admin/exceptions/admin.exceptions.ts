export class AdminNotFoundException extends Error {
  constructor() {
    super("Admin not found");
    this.name = "AdminNotFoundException";
  }
}

export class InvalidCredentialsException extends Error {
  constructor() {
    super("Invalid credentials");
    this.name = "InvalidCredentialsException";
  }
}
