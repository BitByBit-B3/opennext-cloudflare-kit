type LogLevel = "info" | "warn" | "error" | "debug";

interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

function createLogMessage(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>
): LogMessage {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  };
}

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => {
    const log = createLogMessage("info", message, context);
    console.log(JSON.stringify(log));
  },

  warn: (message: string, context?: Record<string, unknown>) => {
    const log = createLogMessage("warn", message, context);
    console.warn(JSON.stringify(log));
  },

  error: (message: string, context?: Record<string, unknown>) => {
    const log = createLogMessage("error", message, context);
    console.error(JSON.stringify(log));
  },

  debug: (message: string, context?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === "development") {
      const log = createLogMessage("debug", message, context);
      console.debug(JSON.stringify(log));
    }
  },
};
