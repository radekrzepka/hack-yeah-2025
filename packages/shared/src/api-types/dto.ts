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
