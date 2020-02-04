import dotenv from 'dotenv';
import fs from 'fs';
import Joi from '@hapi/joi';
import R, { pick } from 'ramda';

export type EnvConfig = Record<string, string>;

const schema = {
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'stage')
    .default('development'),
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().default('jwt_secret'),
  MONGODB_URI: Joi.string().default('mongodb://host.docker.internal:27017'),
};

const safeRead = filePath =>
  fs.existsSync(filePath)
    ? R.compose(dotenv.parse, fs.readFileSync)(filePath)
    : pick(Object.keys(schema), process.env);

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    // tslint:disable-next-line: no-console
    this.envConfig = R.compose(this.validateInput, R.tap(console.log), safeRead)(filePath);
    // tslint:disable-next-line: no-console
    console.log('config = ', this.envConfig, filePath);
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object(schema);

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
}
