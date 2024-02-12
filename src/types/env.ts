declare namespace NodeJS {
  interface ProcessEnv {
    readonly MONGO_USERNAME: string;
    readonly MONGO_PASSWORD: string;
    readonly MONGO_HOST: string;
    readonly MONGO_PORT: string;
    readonly MONGO_DEFAULT_DB_NAME: string;
    readonly JWT_SECRET_CODE: string;
    readonly REDIS_SESSION_HOST: string;
    readonly REDIS_SESSION_PORT: string;
    readonly APP_PORT: string;
  }
}