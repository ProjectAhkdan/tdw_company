export const logger = {
  info: (msg: string, data?: unknown) => console.log("[INFO]", msg, data),
  error: (msg: string, err?: unknown) => console.error("[ERROR]", msg, err),
  warn: (msg: string, data?: unknown) => console.warn("[WARN]", msg, data),
};


