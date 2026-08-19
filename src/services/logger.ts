
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEvent {
  timestamp: string;
  level: LogLevel;
  scope: string;
  event: string;
  operationId: string;
  data?: Record<string, unknown>;
}

interface LoggerOptions {
  enabled?: boolean;
  sink?: (event: LogEvent) => void;
}

const sensitiveKeyPattern = /(password|authorization|access.?token|refresh.?token|id.?token|verification.?token|otp|token)/i;
const emailKeyPattern = /email/i;
const omittedKeyPattern = /full.?name/i;

function maskEmail(value: string) {
  const [local, domain] = value.trim().toLowerCase().split('@');
  if (!local || !domain) return '[redacted-email]';
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${'*'.repeat(Math.max(3, local.length - visible.length))}@${domain}`;
}

function sanitizeValue(value: unknown, key = '', depth = 0): unknown {
  if (sensitiveKeyPattern.test(key)) return '[redacted]';
  if (omittedKeyPattern.test(key)) return '[omitted]';
  if (emailKeyPattern.test(key) && typeof value === 'string') return maskEmail(value);
  if (depth >= 5) return '[max-depth]';
  if (value instanceof Error) {
    const code = (value as Error & { code?: unknown }).code;
    const status = (value as Error & { status?: unknown }).status;
    return {
      name: value.name,
      code: typeof code === 'string' ? code : undefined,
      status: typeof status === 'number' ? status : undefined,
    };
  }
  if (Array.isArray(value)) return value.map((item) => sanitizeValue(item, key, depth + 1));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => (
      [childKey, sanitizeValue(childValue, childKey, depth + 1)]
    )));
  }
  return value;
}

export function sanitizeLogData(data: Record<string, unknown>) {
  return sanitizeValue(data) as Record<string, unknown>;
}

export function createOperationId(prefix = 'op'): string {
  const randomPart = globalThis.crypto?.randomUUID?.()
    ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}-${randomPart}`;
}

function defaultSink(logEvent: LogEvent) {
  const { level, scope, event, ...details } = logEvent;
  console[level](`[${scope}] ${event}`, details);
}

export function createLogger(scope: string, options: LoggerOptions = {}) {
  const enabled = options.enabled ?? (import.meta.env.DEV && import.meta.env.MODE !== 'test');
  const sink = options.sink ?? defaultSink;

  const write = (
    level: LogLevel,
    event: string,
    data?: Record<string, unknown>,
    operationId = createOperationId(),
  ) => {
    if (!enabled) return operationId;
    sink({
      timestamp: new Date().toISOString(),
      level,
      scope,
      event,
      operationId,
      data: data ? sanitizeLogData(data) : undefined,
    });
    return operationId;
  };

  return {
    debug: (event: string, data?: Record<string, unknown>, operationId?: string) => write('debug', event, data, operationId),
    info: (event: string, data?: Record<string, unknown>, operationId?: string) => write('info', event, data, operationId),
    warn: (event: string, data?: Record<string, unknown>, operationId?: string) => write('warn', event, data, operationId),
    error: (event: string, data?: Record<string, unknown>, operationId?: string) => write('error', event, data, operationId),
  };
}

export function safeRequestPath(value?: string) {
  if (!value) return '(unknown)';
  try {
    const parsed = new URL(value, window.location.origin);
    return parsed.pathname;
  } catch {
    return value.split(/[?#]/, 1)[0];
  }
}

