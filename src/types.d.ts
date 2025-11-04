
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      DATABASE_URL?: string;
      REDIS_URL?: string;
      NODE_ENV?: string;
    }
  }
  
  var process: {
    env: NodeJS.ProcessEnv;
  };
}

export {};

