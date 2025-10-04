export class TestTableNotFoundException extends Error {
  public constructor() {
    super("Test table record not found");
    this.name = "TestTableNotFoundException";
  }
}

export class TestTableAlreadyExistsException extends Error {
  public constructor() {
    super("Test table record with this email already exists");
    this.name = "TestTableAlreadyExistsException";
  }
}

export class TestTableCreationException extends Error {
  public constructor() {
    super("Failed to create test table record");
    this.name = "TestTableCreationException";
  }
}

export class TestTableUpdateException extends Error {
  public constructor() {
    super("Failed to update test table record");
    this.name = "TestTableUpdateException";
  }
}

export class TestTableDeletionException extends Error {
  public constructor() {
    super("Failed to delete test table record");
    this.name = "TestTableDeletionException";
  }
}
