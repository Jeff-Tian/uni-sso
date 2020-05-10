import Joi from '@hapi/joi';
import dotenv from 'dotenv';
import fs from 'fs';
import R, { pick } from 'ramda';

export type EnvConfig = Record<string, string>;

export interface Config {
  NODE_ENV: string;
  PORT: string;
  JWT_SECRET: string;
  MONGODB_URI: string;
  env: string;
  KEYCLOAK_CLIENT_ID: string;
  KEYCLOAK_HOST: string;
  KEYCLOAK_REALM: string;
  KEYCLOAK_CLIENT_SECRET: string;
}

const schema = {
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'stage')
    .default('development'),
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().default('jwt_secret'),
  MONGODB_URI: Joi.string().default('mongodb://host.docker.internal:27017'),
  env: Joi.string(),
  KEYCLOAK_CLIENT_ID: Joi.string().default('UniHeart-Client-Local-3000'),
  KEYCLOAK_HOST: Joi.string().default(
    'https://keycloak.jiwai.win',
  ),
  KEYCLOAK_REALM: Joi.string().default('UniHeart'),
  KEYCLOAK_CLIENT_SECRET: Joi.string(),
};

const safeRead = filePath =>
  fs.existsSync(filePath)
    ? R.compose(dotenv.parse, fs.readFileSync)(filePath)
    : pick(Object.keys(schema), process.env);

export class ConfigService implements Config {
  NODE_ENV: string;
  PORT: string;
  JWT_SECRET: string;
  MONGODB_URI: string;
  env: string;
  KEYCLOAK_CLIENT_ID: string;
  KEYCLOAK_HOST: string;
  private readonly envConfig: EnvConfig;

  constructor(filePath: string, overrideFilePath?: string) {
    // tslint:disable-next-line:no-console
    console.log('filePath = ', filePath, overrideFilePath);

    this.envConfig = this.validateInput({
      ...safeRead(filePath),
      ...(overrideFilePath ? safeRead(overrideFilePath) : {}),
    });

    this.NODE_ENV = this.get('NODE_ENV');
    this.PORT = this.get('PORT');
    this.JWT_SECRET = this.get('JWT_SECRET');
    this.MONGODB_URI = this.get('MONGODB_URI');
    this.env = this.get('env');
    this.KEYCLOAK_CLIENT_ID = this.get('KEYCLOAK_CLIENT_ID');
    this.KEYCLOAK_HOST = this.get('KEYCLOAK_HOST');
    this.KEYCLOAK_REALM = this.get('KEYCLOAK_REALM');
    this.KEYCLOAK_CLIENT_SECRET = this.get('KEYCLOAK_CLIENT_SECRET');
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object(schema);

    try {
      const { error, value: validatedEnvConfig } = envVarsSchema.validate(
        envConfig,
      );

      if (error) {
        throw new Error(`Config validation error: ${error.message}`);
      }
      return validatedEnvConfig;
    } catch (ex) {
      // tslint:disable-next-line:no-console
      console.error('validate config error: ', ex, envConfig);

      throw ex;
    }
  }

  KEYCLOAK_REALM: string;
  KEYCLOAK_CLIENT_SECRET: string;
}
