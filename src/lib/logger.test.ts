import { afterEach, describe, expect, it, vi } from "vitest";

import { createLogger, type LogContext } from "./logger";

type SinkCall =
  | {
      level: "debug" | "info" | "warn";
      message: string;
      context?: LogContext;
    }
  | {
      level: "error";
      message: string;
      error?: unknown;
      context?: LogContext;
    };

function createTestSink() {
  const calls: SinkCall[] = [];

  return {
    calls,
    sink: {
      debug(message: string, context?: LogContext): void {
        calls.push({ level: "debug", message, context });
      },
      info(message: string, context?: LogContext): void {
        calls.push({ level: "info", message, context });
      },
      warn(message: string, context?: LogContext): void {
        calls.push({ level: "warn", message, context });
      },
      error(message: string, error?: unknown, context?: LogContext): void {
        calls.push({ level: "error", message, error, context });
      }
    }
  };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("logger in development", () => {
  it("outputs debug, info, warn, and error logs", () => {
    const { calls, sink } = createTestSink();
    const logger = createLogger({
      getEnvironment: () => "development",
      sink
    });

    logger.debug("debug_message");
    logger.info("info_message");
    logger.warn("warn_message");
    logger.error("error_message");

    expect(calls.map((call) => call.level)).toEqual([
      "debug",
      "info",
      "warn",
      "error"
    ]);
  });
});

describe("logger in staging", () => {
  it("does not output debug logs", () => {
    const { calls, sink } = createTestSink();
    const logger = createLogger({
      getEnvironment: () => "staging",
      sink
    });

    logger.debug("debug_message");
    logger.info("info_message");
    logger.warn("warn_message");
    logger.error("error_message");

    expect(calls.map((call) => call.level)).toEqual([
      "info",
      "warn",
      "error"
    ]);
  });
});

describe("logger in production", () => {
  it("only outputs warn and error logs", () => {
    const { calls, sink } = createTestSink();
    const logger = createLogger({
      getEnvironment: () => "production",
      sink
    });

    logger.debug("debug_message");
    logger.info("info_message");
    logger.warn("warn_message");
    logger.error("error_message");

    expect(calls.map((call) => call.level)).toEqual(["warn", "error"]);
  });
});

describe("logger context", () => {
  it("keeps allowed context", () => {
    const { calls, sink } = createTestSink();
    const logger = createLogger({
      getEnvironment: () => "development",
      sink
    });

    logger.info("goal_setting_updated", {
      screen: "settings",
      action: "save",
      isSuccess: true,
      retryCount: 0,
      result: null
    });

    expect(calls).toEqual([
      {
        level: "info",
        message: "goal_setting_updated",
        context: {
          screen: "settings",
          action: "save",
          isSuccess: true,
          retryCount: 0,
          result: null
        }
      }
    ]);
  });

  it("removes sensitive context", () => {
    const { calls, sink } = createTestSink();
    const logger = createLogger({
      getEnvironment: () => "development",
      sink
    });

    logger.warn("failed_to_validate_input", {
      screen: "home",
      weightKg: 80,
      memo: "private note",
      email: "user@example.com",
      authToken: "secret"
    });

    expect(calls).toEqual([
      {
        level: "warn",
        message: "failed_to_validate_input",
        context: {
          screen: "home"
        }
      }
    ]);
  });

  it("passes undefined context through", () => {
    const { calls, sink } = createTestSink();
    const logger = createLogger({
      getEnvironment: () => "development",
      sink
    });

    logger.info("weight_records_loaded");

    expect(calls).toEqual([
      {
        level: "info",
        message: "weight_records_loaded",
        context: undefined
      }
    ]);
  });
});

describe("logger error", () => {
  it("sanitizes Error objects", () => {
    const { calls, sink } = createTestSink();
    const logger = createLogger({
      getEnvironment: () => "development",
      sink
    });

    logger.error("failed_to_save_weight_record", new TypeError("secret"), {
      screen: "records"
    });

    expect(calls).toEqual([
      {
        level: "error",
        message: "failed_to_save_weight_record",
        error: {
          name: "TypeError"
        },
        context: {
          screen: "records"
        }
      }
    ]);
  });

  it("passes non-Error values through", () => {
    const { calls, sink } = createTestSink();
    const logger = createLogger({
      getEnvironment: () => "development",
      sink
    });

    logger.error("unexpected_error", "error_code");

    expect(calls).toEqual([
      {
        level: "error",
        message: "unexpected_error",
        error: "error_code",
        context: undefined
      }
    ]);
  });
});

describe("default logger", () => {
  it("uses console methods in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    const debug = vi.spyOn(console, "debug").mockImplementation(() => {});
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const logger = createLogger();

    logger.debug("debug_message");
    logger.info("info_message");
    logger.warn("warn_message");
    logger.error("error_message", "error_code");

    expect(debug).toHaveBeenCalledWith("debug_message", undefined);
    expect(info).toHaveBeenCalledWith("info_message", undefined);
    expect(warn).toHaveBeenCalledWith("warn_message", undefined);
    expect(error).toHaveBeenCalledWith(
      "error_message",
      "error_code",
      undefined
    );
  });

  it("uses staging rules for Vercel preview deployments", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "preview");
    const debug = vi.spyOn(console, "debug").mockImplementation(() => {});
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const logger = createLogger();

    logger.debug("debug_message");
    logger.info("info_message");

    expect(debug).not.toHaveBeenCalled();
    expect(info).toHaveBeenCalledWith("info_message", undefined);
  });

  it("uses production rules for production deployments", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "production");
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const logger = createLogger();

    logger.info("info_message");
    logger.warn("warn_message");

    expect(info).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith("warn_message", undefined);
  });
});
