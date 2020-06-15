import Joi from '@hapi/joi';
import dotenv from 'dotenv';
import fs from 'fs';
import R, { pick } from 'ramda';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';

export type EnvConfig = Record<string, string | number>;

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
  ELASTIC_SEARCH_NODE: string;

  getTypeOrmConfig: () => TypeOrmModuleOptions;
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
  KEYCLOAK_HOST: Joi.string().default('https://keycloak.jiwai.win'),
  KEYCLOAK_REALM: Joi.string().default('UniHeart'),
  KEYCLOAK_CLIENT_SECRET: Joi.string(),
  WECHAT_MP_APP_ID: Joi.string(),
  WECHAT_MP_APP_SECRET: Joi.string(),
  ELASTIC_SEARCH_NODE: Joi.string(),

  POSTGRES_URL: Joi.string().optional(),
  POSTGRES_HOST: Joi.string().optional(),
  POSTGRES_PORT: Joi.number().optional(),
  POSTGRES_USERNAME: Joi.string().optional(),
  POSTGRES_PASSWORD: Joi.string().optional(),
  POSTGRES_DATABASE: Joi.string().optional(),
};

const parseFromFile = R.compose(
  dotenv.parse,
  fs.readFileSync,
);
const parseFromEnv = pick(Object.keys(schema), process.env);

const safeRead = filePath =>
  fs.existsSync(filePath) ? parseFromFile(filePath) : parseFromEnv;

export class ConfigService implements Config {
  NODE_ENV: string;
  PORT: string;
  JWT_SECRET: string;
  MONGODB_URI: string;
  env: string;
  KEYCLOAK_CLIENT_ID: string;
  KEYCLOAK_HOST: string;
  private readonly envConfig: EnvConfig;
  WECHAT_MP_APP_ID: string;
  WECHAT_MP_APP_SECRET: string;
  ELASTIC_SEARCH_NODE: string;

  constructor(filePath: string, overrideFilePath?: string) {
    this.envConfig = this.validateInput({
      ...safeRead(filePath),
      ...(overrideFilePath ? safeRead(overrideFilePath) : {}),
    });

    this.NODE_ENV = this.get('NODE_ENV') as string;
    this.PORT = this.get('PORT') as string;
    this.JWT_SECRET = this.get('JWT_SECRET') as string;
    this.MONGODB_URI = this.get('MONGODB_URI') as string;
    this.env = this.get('env') as string;
    this.KEYCLOAK_CLIENT_ID = this.get('KEYCLOAK_CLIENT_ID') as string;
    this.KEYCLOAK_HOST = this.get('KEYCLOAK_HOST') as string;
    this.KEYCLOAK_REALM = this.get('KEYCLOAK_REALM') as string;
    this.KEYCLOAK_CLIENT_SECRET = this.get('KEYCLOAK_CLIENT_SECRET') as string;
    this.WECHAT_MP_APP_ID = this.get('WECHAT_MP_APP_ID') as string;
    this.WECHAT_MP_APP_SECRET = this.get('WECHAT_MP_APP_SECRET') as string;
    this.ELASTIC_SEARCH_NODE = this.get('ELASTIC_SEARCH_NODE') as string;
  }

  get(key: string): string | number {
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

  getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: this.get('POSTGRES_URL') as string,
      host: this.get('POSTGRES_HOST') as string,
      port: this.get('POSTGRES_PORT') as number,
      username: this.get('POSTGRES_USERNAME') as string,
      password: this.get('POSTGRES_PASSWORD') as string,
      database: this.get('POSTGRES_DATABASE') as string,
      autoLoadEntities: true,
    };
  }
}
