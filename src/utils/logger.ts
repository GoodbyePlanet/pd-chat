import pino, { Logger } from "pino";

export const logger: Logger =
  process.env["NODE_ENV"] === "production"
    ? pino({ level: "WARN" }) // JSON in production
    : pino({
        // Pretty print in development
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
        level: "debug",
      });
