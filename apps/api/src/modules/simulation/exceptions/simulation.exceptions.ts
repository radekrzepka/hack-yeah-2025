export class SimulationCreationException extends Error {
  public constructor() {
    super("Failed to create simulation request");
    this.name = "SimulationCreationException";
  }
}

export class SimulationNotFoundException extends Error {
  public constructor() {
    super("Simulation not found");
    this.name = "SimulationNotFoundException";
  }
}
