import { plainToInstance } from "class-transformer";
import { IsInt, Matches, Max, Min, validateSync } from "class-validator";

export class EnvironmentVariables {
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number = 3000;

  @Matches(/^mongodb(\+srv)?:\/\/.+/, {
    message:
      "MONGODB_URI must be a mongodb:// or mongodb+srv:// connection string",
  })
  MONGODB_URI!: string;
}

// Runs once at startup (ConfigModule's `validate` hook): converts the raw strings,
// applies the defaults above, and stops the app with a readable message if anything is invalid.
export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const env = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(env);

  if (errors.length > 0) {
    const messages = errors.flatMap((error) =>
      Object.values(error.constraints ?? {}),
    );

    throw new Error(
      `Invalid environment variables:\n- ${messages.join("\n- ")}`,
    );
  }

  return env;
}
