
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      DATABASE_URL?: string;
      REDIS_URL?: string;
      NODE_ENV?: string;
    }
  }
}

export {};

