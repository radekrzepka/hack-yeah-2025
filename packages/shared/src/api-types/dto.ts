/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface LoginRequestDto {
  /**
   * Admin login
   * @example "admin"
   */
  login: string;
  /**
   * Admin password
   * @example "123"
   */
  password: string;
}

export interface LoginResponseDto {
  /**
   * JWT token for authentication
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  token: string;
}

export interface GetAllSimulationResultsResponseDto {
  /**
   * Simulation result ID
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;
  /**
   * Test value
   * @example 42
   */
  test: number;
}

export interface SendSimulationRequestDto {
  /**
   * Age of the person
   * @min 0
   * @example 30
   */
  age: number;
  /**
   * Sex of the person
   * @example "male"
   */
  sex: "male" | "female";
  /**
   * Gross salary amount
   * @min 0
   * @example 7500
   */
  grossSalary: number;
  /**
   * Work start date in ISO 8601 format
   * @format date
   * @example "2015-01-01"
   */
  workStartDate: string;
  /**
   * Planned retirement year
   * @min 1900
   * @example 2060
   */
  plannedRetirementYear: number;
  /**
   * Whether to include sick leave in calculation
   * @example true
   */
  includeSickLeave: boolean;
}

export interface SendSimulationResponseDto {
  /**
   * Unique simulation request identifier (token)
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;
}

export interface GetSimulationResultResponseDto {
  /**
   * Simulation token ID
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;
  /**
   * Test value generated for simulation
   * @example 5432
   */
  test: number;
}

export interface HealthCheckResponseDto {
  /**
   * Overall health status
   * @example "healthy"
   */
  status: "healthy" | "unhealthy";
  /**
   * ISO timestamp of the health check
   * @example "2024-01-15T10:30:00.000Z"
   */
  timestamp: string;
  /**
   * Application uptime in seconds
   * @example 3600
   */
  uptime: number;
  /**
   * Health check response time in milliseconds
   * @example 25
   */
  responseTime: number;
  /**
   * Application version
   * @example "1.0.0"
   */
  version: string;
  /**
   * Current environment
   * @example "production"
   */
  environment: string;
  /**
   * Individual service checks
   * @example {"database":true,"api":true}
   */
  checks: object;
  /**
   * HTTP status code
   * @example 200
   */
  httpStatus: number;
}

export interface CreateTestTableRequestDto {
  /**
   * Valid email address (1-255 characters)
   * @format email
   * @maxLength 255
   * @example "user@example.com"
   */
  email: string;
  /**
   * First name (1-128 characters)
   * @maxLength 128
   * @example "John"
   */
  firstName: string;
}

export interface CreateTestTableResponseDto {
  /**
   * Unique identifier
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;
  /**
   * Email address
   * @example "user@example.com"
   */
  email: string;
  /**
   * First name
   * @example "John"
   */
  firstName: string;
}

export interface GetTestTableResponseDto {
  /**
   * Unique identifier
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;
  /**
   * Email address
   * @example "user@example.com"
   */
  email: string;
  /**
   * First name
   * @example "John"
   */
  firstName: string;
}

export interface UpdateTestTableRequestDto {
  /**
   * Valid email address (1-255 characters)
   * @format email
   * @maxLength 255
   * @example "user@example.com"
   */
  email?: string;
  /**
   * First name (1-128 characters)
   * @maxLength 128
   * @example "John"
   */
  firstName?: string;
}

export interface UpdateTestTableResponseDto {
  /**
   * Unique identifier
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;
  /**
   * Email address
   * @example "user@example.com"
   */
  email: string;
  /**
   * First name
   * @example "John"
   */
  firstName: string;
}

export interface DeleteTestTableResponseDto {
  /**
   * Whether the deletion was successful
   * @example true
   */
  success: boolean;
  /**
   * Success message
   * @example "Test table record deleted successfully"
   */
  message: string;
}
