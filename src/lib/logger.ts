export type LogContext = Record<string, string | number | boolean | null>;

type LogEnvironment = "development" | "staging" | "production";
type LogLevel = "debug" | "info" | "warn" | "error";

type ConsoleSink = {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: unknown, context?: LogContext): void;
};

type LoggerOptions = {
  getEnvironment?: () => LogEnvironment;
  sink?: ConsoleSink;
};

const SENSITIVE_CONTEXT_KEY_PATTERNS = [
  "weight",
  "memo",
  "email",
  "user_id",
  "userid",
  "user",
  "name",
  "password",
  "token",
  "cookie",
  "session",
  "auth"
];

const DEFAULT_SINK: ConsoleSink = {
  debug(message, context) {
    console.debug(message, context);
  },
  info(message, context) {
    console.info(message, context);
  },
  warn(message, context) {
    console.warn(message, context);
  },
  error(message, error, context) {
    console.error(message, error, context);
  }
};

export function createLogger(options: LoggerOptions = {}) {
  const getEnvironment = options.getEnvironment ?? getCurrentEnvironment;
  const sink = options.sink ?? DEFAULT_SINK;

  return {
    debug(message: string, context?: LogContext): void {
      if (shouldLog("debug", getEnvironment())) {
        sink.debug(message, sanitizeContext(context));
      }
    },
    info(message: string, context?: LogContext): void {
      if (shouldLog("info", getEnvironment())) {
        sink.info(message, sanitizeContext(context));
      }
    },
    warn(message: string, context?: LogContext): void {
      sink.warn(message, sanitizeContext(context));
    },
    error(message: string, error?: unknown, context?: LogContext): void {
      sink.error(message, sanitizeError(error), sanitizeContext(context));
    }
  };
}

export const logger = createLogger();

function getCurrentEnvironment(): LogEnvironment {
  if (process.env.NODE_ENV === "production") {
    return process.env.VERCEL_ENV === "preview" ? "staging" : "production";
  }

  return "development";
}

function shouldLog(level: LogLevel, environment: LogEnvironment): boolean {
  if (environment === "development") {
    return true;
  }

  if (environment === "staging") {
    return level !== "debug";
  }

  return level === "warn" || level === "error";
}

function sanitizeContext(context?: LogContext): LogContext | undefined {
  if (context === undefined) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(context).filter(
      ([key]) => !isSensitiveContextKey(key)
    )
  );
}

function sanitizeError(error: unknown): unknown {
  if (error instanceof Error) {
    return {
      name: error.name
    };
  }

  return error;
}

function isSensitiveContextKey(key: string): boolean {
  const normalizedKey = key.toLowerCase().replaceAll("-", "_");

  return SENSITIVE_CONTEXT_KEY_PATTERNS.some((pattern) =>
    normalizedKey.includes(pattern)
  );
}
