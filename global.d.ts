declare namespace NodeJS {
  interface ProcessEnv {
    CLERK_SECRET_KEY: string;
    CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: string;
    CLERK_SIGN_IN_URL: string;
    CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: string;
    CLERK_SIGN_UP_URL: string;
    DB_URL: string;
    DB_URL: string;
    VITE_CLERK_PUBLISHABLE_KEY: string;
    XATA_API_KEY: string;
    XATA_BRANCH: string;
  }
}

interface Response {
  json(): Promise<unknown>;
}
