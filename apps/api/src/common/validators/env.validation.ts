import { plainToInstance } from "class-transformer";
import {
  IsBooleanString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from "class-validator";

class EnvironmentVariables {
  @IsString()
  NODE_ENV!: string;

  @IsString()
  NEXT_PUBLIC_APP_URL!: string;

  @IsString()
  NEXT_PUBLIC_API_URL!: string;

  @IsBooleanString()
  IS_LOCAL!: string;

  @IsOptional()
  @IsBooleanString()
  CI!: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT!: number;

  @IsString()
  DATABASE_URL!: string;

  @IsOptional()
  @IsString()
  AWS_ACCESS_KEY_ID?: string;

  @IsOptional()
  @IsString()
  AWS_SECRET_ACCESS_KEY?: string;
}

export function validateEnvs(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
