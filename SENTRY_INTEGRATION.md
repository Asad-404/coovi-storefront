# Sentry Integration Guide

This document explains how to integrate Sentry for production error tracking while keeping customer data safe.

## How Error Tracking Works

### Client-Side Error Flow
1. Error occurs (network failure, API error, etc.)
2. `parseApiError()` converts it to structured `AppError`
3. `logError()` sanitizes context and sends to Sentry
4. Sentry groups errors by correlation ID and error code
5. You can trace errors across backend and frontend using correlation ID

### What Gets Sent to Sentry (Safe)
- ✅ Error code (e.g., `NETWORK_ERROR`, `TIMEOUT_ERROR`)
- ✅ HTTP status code
- ✅ Correlation ID (for tracing backend errors)
- ✅ Timestamp
- ✅ User agent and URL
- ✅ Context identifiers (e.g., `checkout_submit`, `product_listing`)
- ✅ Non-sensitive metadata (item counts, page names)

### What's Redacted (Protected)
- ❌ Customer names, phones, addresses
- ❌ Order details and cart contents
- ❌ Form field values
- ❌ API keys and tokens
- ❌ Any field containing: `phone`, `email`, `password`, `address`, `customerName`, `secret`, `token`

## Setup Instructions

### 1. Install Sentry SDK

```bash
npm install @sentry/nextjs
```

### 2. Initialize Sentry

Create `sentry.client.config.ts` in the root directory:

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // Reduce in production to save quota
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Set profilesSampleRate to 1.0 to profile every transaction.
  // Adjust or remove in production
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Only send errors in production
  enabled: process.env.NODE_ENV === 'production',
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Filter out browser extension errors
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
  ],
  
  // Before sending, ensure no PII
  beforeSend(event) {
    // Remove query strings from URLs that might contain sensitive data
    if (event.request?.url) {
      const url = new URL(event.request.url);
      url.search = ''; // Remove query params
      event.request.url = url.toString();
    }
    
    // Remove cookies
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    
    return event;
  },
});
```

Create `sentry.server.config.ts` in the root directory:

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  enabled: process.env.NODE_ENV === 'production',
  environment: process.env.NODE_ENV,
});
```

### 3. Configure Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/your-project-id
```

Add to `.env.production`:

```env
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/your-project-id
```

### 4. Update next.config.js

```javascript
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  // ... your existing config
};

module.exports = withSentryConfig(
  nextConfig,
  {
    // Sentry webpack plugin options
    silent: true,
    org: "your-org-name",
    project: "coovi-storefront",
  },
  {
    // Upload source maps in production only
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: "/monitoring",
    hideSourceMaps: true,
    disableLogger: true,
  }
);
```

### 5. Test in Development

```bash
npm run dev
```

Trigger an error (e.g., disconnect internet and try to load products). Check browser console for `[AppError]` logs.

### 6. Deploy to Production

```bash
npm run build
npm start
```

Errors will be sent to Sentry automatically.

## Tracing Errors with Correlation ID

When an error occurs:

1. **Frontend**: Check Sentry for the error with correlation ID
2. **Backend**: Search logs for the same correlation ID
3. **Trace the flow**: Backend → API → Frontend

Example:
```
Frontend Error:
  Code: EXTERNAL_SERVICE_ERROR
  Correlation ID: req_abc123xyz
  Context: checkout_submit
  
Backend Log (search for req_abc123xyz):
  [ERROR] Steadfast API timeout
  Request ID: req_abc123xyz
  Endpoint: POST /api/orders
```

## Sentry Dashboard Setup

### Recommended Alerts

1. **High Error Rate**: Alert when error rate exceeds 5% in 5 minutes
2. **Critical Errors**: Alert on any `INTERNAL_ERROR` or 500 status
3. **Checkout Failures**: Alert on errors with context `checkout_submit`

### Useful Filters

- `error_code:NETWORK_ERROR` - Network issues
- `error_code:TIMEOUT_ERROR` - API timeouts
- `status_code:500` - Server errors
- `tags.context:checkout_submit` - Checkout errors

## Data Privacy Compliance

The `sanitizeContext()` function automatically redacts:
- Personal identifiable information (PII)
- Payment information
- Form data
- Customer details

Review `lib/errorParser.ts` `sanitizeContext()` function to add more sensitive keys if needed.

## Example: What Sentry Receives

### Safe Error Report
```json
{
  "message": "Request timeout. The server took too long to respond.",
  "level": "warning",
  "tags": {
    "error_code": "TIMEOUT_ERROR",
    "status_code": 504
  },
  "contexts": {
    "error_details": {
      "code": "TIMEOUT_ERROR",
      "statusCode": 504,
      "isRetryable": true,
      "timestamp": "2026-11-17T12:34:56.789Z"
    },
    "additional_context": {
      "context": "checkout_submit",
      "itemCount": "[redacted]",
      "area": "inside_dhaka"
    }
  },
  "fingerprint": ["TIMEOUT_ERROR", "req_abc123"]
}
```

Note: Customer name, phone, address, and cart items are NOT included.

## Monitoring Best Practices

1. **Regular Reviews**: Check Sentry dashboard weekly
2. **Set Quotas**: Limit events per month to control costs
3. **Alert Fatigue**: Only alert on actionable errors
4. **Correlation IDs**: Use them to trace backend issues
5. **Error Budgets**: Set acceptable error rates per service

## Testing Error Logging

To verify error logging works without sensitive data:

1. Open browser DevTools Console
2. Trigger an error (e.g., checkout with network disabled)
3. Check console output for `[AppError]`
4. Verify no customer data appears in the log
5. Check Sentry dashboard (in production)

## Troubleshooting

### Errors Not Appearing in Sentry

1. Check `NEXT_PUBLIC_SENTRY_DSN` is set
2. Verify Sentry is initialized: `window.Sentry` should exist
3. Check browser console for Sentry errors
4. Ensure `NODE_ENV=production`

### Too Many Events

1. Reduce `tracesSampleRate` in config
2. Add more patterns to `ignoreErrors`
3. Set up event quotas in Sentry dashboard

### Missing Context

1. Update `logError()` calls to include relevant context
2. Ensure context keys are not in `sensitiveKeys` list
3. Check `sanitizeContext()` isn't over-redacting
