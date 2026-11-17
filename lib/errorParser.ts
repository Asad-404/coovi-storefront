import { AppError, ErrorCode } from './errors';
import type { ApiErrorResponse, LegacyErrorResponse } from './errors';

/**
 * Sentry scope interface for type safety
 */
interface SentryScope {
  setLevel: (level: 'error' | 'warning' | 'info') => void;
  setFingerprint: (fingerprint: string[]) => void;
  setContext: (name: string, context: Record<string, unknown>) => void;
  setTag: (key: string, value: string | number) => void;
}

/**
 * Check if error is a timeout error
 */
function isTimeoutError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === 'TimeoutError' || error.name === 'AbortError')
  );
}

/**
 * Parse fetch/API error response and create structured AppError
 */
export function parseApiError(error: unknown): AppError {
  // Handle timeout errors
  if (isTimeoutError(error)) {
    return new AppError({
      message: 'Request timeout. The server took too long to respond.',
      code: ErrorCode.TIMEOUT_ERROR,
      isRetryable: true,
    });
  }

  // Handle fetch errors (network errors, etc.)
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new AppError({
      message: 'Network error. Please check your connection and try again.',
      code: ErrorCode.NETWORK_ERROR,
      isRetryable: true,
    });
  }

  // Handle AppError (already structured)
  if (error instanceof AppError) {
    return error;
  }

  // Handle generic Error
  if (error instanceof Error) {
    return new AppError({
      message: error.message,
      code: ErrorCode.UNKNOWN_ERROR,
    });
  }

  // Unknown error type
  return new AppError({
    message: 'An unexpected error occurred',
    code: ErrorCode.UNKNOWN_ERROR,
  });
}

/**
 * Parse API response error (when response is not ok)
 */
export async function parseApiResponseError(
  response: Response
): Promise<AppError> {
  try {
    const data = (await response.json()) as ApiErrorResponse | LegacyErrorResponse;

    // Structured error from backend
    if (data && 'error' in data && data.error) {
      const structured = data as ApiErrorResponse;
      return new AppError({
        message: structured.error.message,
        code: (structured.error.code as ErrorCode) || ErrorCode.UNKNOWN_ERROR,
        statusCode: response.status,
        correlationId: structured.error.correlationId,
        context: structured.error.context,
        isRetryable: response.status >= 500 && response.status < 600,
      });
    }

    // Legacy error format
    if (data && 'message' in data && typeof data.message === 'string') {
      return new AppError({
        message: data.message,
        code: mapStatusToErrorCode(response.status),
        statusCode: response.status,
        isRetryable: response.status >= 500 && response.status < 600,
      });
    }
  } catch {
    // Failed to parse JSON
  }

  // Generic HTTP error
  return new AppError({
    message: `Request failed with status ${response.status}`,
    code: mapStatusToErrorCode(response.status),
    statusCode: response.status,
    isRetryable: response.status >= 500 && response.status < 600,
  });
}

/**
 * Map HTTP status code to error code
 */
function mapStatusToErrorCode(status: number): ErrorCode {
  switch (status) {
    case 400: return ErrorCode.VALIDATION_ERROR;
    case 401: return ErrorCode.AUTHENTICATION_ERROR;
    case 403: return ErrorCode.AUTHORIZATION_ERROR;
    case 404: return ErrorCode.NOT_FOUND;
    case 422: return ErrorCode.BUSINESS_ERROR;
    case 429: return ErrorCode.RATE_LIMIT_EXCEEDED;
    case 500: return ErrorCode.INTERNAL_ERROR;
    case 502:
    case 503:
    case 504: return ErrorCode.EXTERNAL_SERVICE_ERROR;
    default:  return ErrorCode.UNKNOWN_ERROR;
  }
}

/**
 * Get user-friendly error message from any error
 */
export function getErrorMessage(
  err: unknown,
  fallback: string = 'An error occurred'
): string {
  const appError = parseApiError(err);
  return appError.getUserMessage() || fallback;
}

/**
 * Log error to console (in development) or error tracking service (in production)
 */
export function logError(error: AppError, context?: Record<string, unknown>): void {
  const errorLog = {
    ...error.toJSON(),
    additionalContext: context,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  };

  if (process.env.NODE_ENV === 'development') {
    console.error('[AppError]', errorLog);
  } else {
    // In production, send to Sentry
    if (typeof window !== 'undefined' && (window as Window & { Sentry?: unknown }).Sentry) {
      const Sentry = (window as Window & { Sentry?: unknown }).Sentry as {
        withScope: (callback: (scope: SentryScope) => void) => void;
        captureException: (error: Error) => void;
      };

      Sentry.withScope((scope: SentryScope) => {
        // Set error level based on status code
        scope.setLevel(error.statusCode && error.statusCode >= 500 ? 'error' : 'warning');

        // Set correlation ID as fingerprint for grouping
        if (error.correlationId) {
          scope.setFingerprint([error.code, error.correlationId]);
        }

        // Add context without sensitive data
        scope.setContext('error_details', {
          code: error.code,
          statusCode: error.statusCode,
          isRetryable: error.isRetryable,
          timestamp: error.timestamp,
        });

        // Add safe context data (no PII)
        if (context) {
          scope.setContext('additional_context', sanitizeContext(context));
        }

        // Set tags for filtering
        scope.setTag('error_code', error.code);
        if (error.statusCode) {
          scope.setTag('status_code', error.statusCode);
        }

        // Capture the error
        Sentry.captureException(error);
      });
    } else {
      // Fallback to console if Sentry not initialized
      console.error('[AppError]', JSON.stringify(errorLog));
    }
  }
}

/**
 * Sanitize context to remove sensitive data before logging
 */
function sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  // List of keys that might contain sensitive data
  const sensitiveKeys = [
    'phone', 'customerName', 'address', 'email',
    'password', 'token', 'apiKey', 'secret',
    'street', 'flat', 'thana', 'district', 'notes',
    'items', 'form', 'orderData'
  ];

  for (const [key, value] of Object.entries(context)) {
    const lowerKey = key.toLowerCase();

    // Skip sensitive keys
    if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
      // Only log existence or count, not actual data
      if (Array.isArray(value)) {
        sanitized[key] = `[${value.length} items]`;
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = '[object]';
      } else {
        sanitized[key] = '[redacted]';
      }
      continue;
    }

    // Safe to log these values
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value;
    } else if (Array.isArray(value)) {
      sanitized[key] = `[${value.length} items]`;
    } else if (value === null || value === undefined) {
      sanitized[key] = value;
    } else {
      sanitized[key] = '[object]';
    }
  }

  return sanitized;
}

/**
 * Get user-friendly message based on error code
 */
export function getErrorCodeMessage(code: ErrorCode): string {
  const messages: Record<ErrorCode, string> = {
    [ErrorCode.VALIDATION_ERROR]: 'Invalid input. Please check your data and try again.',
    [ErrorCode.MALFORMED_JSON]: 'Invalid data format.',
    [ErrorCode.INVALID_ID]: 'Invalid identifier.',
    [ErrorCode.DUPLICATE_KEY]: 'This record already exists.',
    [ErrorCode.AUTHENTICATION_ERROR]: 'Authentication failed.',
    [ErrorCode.AUTHORIZATION_ERROR]: 'You do not have permission to perform this action.',
    [ErrorCode.NOT_FOUND]: 'The requested item was not found.',
    [ErrorCode.BUSINESS_ERROR]: 'This action cannot be completed.',
    [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please try again later.',
    [ErrorCode.DATABASE_ERROR]: 'A database error occurred. Please try again.',
    [ErrorCode.EXTERNAL_SERVICE_ERROR]: 'An external service is unavailable. Please try again later.',
    [ErrorCode.INTERNAL_ERROR]: 'An internal error occurred. Please try again.',
    [ErrorCode.NETWORK_ERROR]: 'Network error. Please check your connection.',
    [ErrorCode.TIMEOUT_ERROR]: 'Request timeout. The server is taking longer than expected.',
    [ErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred.',
  };

  return messages[code] ?? messages[ErrorCode.UNKNOWN_ERROR];
}
