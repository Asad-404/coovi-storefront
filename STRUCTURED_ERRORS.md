# Structured Error Handling - Frontend (Next.js)

This document explains the structured error handling system implemented in the Coovi Storefront (Next.js).

## Overview

The structured error handling system provides:

- **Consistent error parsing** from API responses
- **Rich context data** for debugging
- **Correlation ID tracking** from backend
- **User-friendly error messages**
- **Automatic error logging**
- **Type-safe error handling**
- **Ready for Sentry integration**

## Error Types

### AppError

The main error class for frontend errors. Contains:

- `code`: Error code (enum)
- `message`: Human-readable error message
- `statusCode`: HTTP status code (if from API)
- `correlationId`: Request tracking ID from backend
- `timestamp`: When the error occurred
- `context`: Additional data about the error
- `isRetryable`: Whether the operation can be retried

### Error Codes

```typescript
enum ErrorCode {
  // Client Errors (4xx)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  BUSINESS_ERROR = 'BUSINESS_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Server Errors (5xx)
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',

  // Client-side errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}
```

## Usage Examples

### Basic Error Handling with Fetch

```typescript
import { parseApiError, parseApiResponseError, getErrorMessage } from '@/lib/errorParser';

async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    
    if (!res.ok) {
      const error = await parseApiResponseError(res);
      throw error;
    }
    
    return await res.json();
  } catch (error) {
    const appError = parseApiError(error);
    
    // Get user-friendly message
    const message = appError.getUserMessage();
    
    // Check if retryable
    if (appError.isRetryable) {
      // Show retry button
    }
    
    throw appError;
  }
}
```

### With Error Logging

```typescript
import { parseApiError, logError } from '@/lib/errorParser';

async function createOrder(data: any) {
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const error = await parseApiResponseError(res);
      logError(error, { action: 'createOrder', data });
      throw error;
    }
    
    return await res.json();
  } catch (error) {
    const appError = parseApiError(error);
    logError(appError, { action: 'createOrder' });
    throw appError;
  }
}
```

### Client Component Error Handling

```typescript
'use client';

import { useState } from 'react';
import { parseApiError, getErrorCodeMessage } from '@/lib/errorParser';
import { ErrorCode } from '@/lib/errors';

export default function CheckoutForm() {
  const [error, setError] = useState<string | null>(null);
  
  async function handleSubmit(data: any) {
    try {
      setError(null);
      const res = await fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const appError = await parseApiResponseError(res);
        
        // Show specific messages for different errors
        if (appError.code === ErrorCode.BUSINESS_ERROR) {
          setError('This product is out of stock');
        } else if (appError.isNetworkError()) {
          setError('Network error. Please try again.');
        } else {
          setError(appError.getUserMessage());
        }
        return;
      }
      
      // Success
    } catch (err) {
      const appError = parseApiError(err);
      setError(appError.getUserMessage());
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* form fields */}
    </form>
  );
}
```

### Server Component Error Handling

```typescript
import { parseApiError, parseApiResponseError } from '@/lib/errorParser';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${API_URL}/products/${params.id}`);
    
    if (!res.ok) {
      const error = await parseApiResponseError(res);
      
      // Handle 404
      if (error.statusCode === 404) {
        notFound();
      }
      
      throw error;
    }
    
    const product = await res.json();
    return <ProductDetails product={product} />;
    
  } catch (error) {
    const appError = parseApiError(error);
    
    // Show error page
    return (
      <div>
        <h1>Error Loading Product</h1>
        <p>{appError.getUserMessage()}</p>
        {appError.isRetryable && <button>Retry</button>}
      </div>
    );
  }
}
```

### Checking Error Types

```typescript
const appError = parseApiError(error);

// Check if network error
if (appError.isNetworkError()) {
  // Show network error message
}

// Check if retryable
if (appError.isRetryable) {
  // Show retry button
}

// Check specific error code
if (appError.code === ErrorCode.TIMEOUT_ERROR) {
  // Show timeout message with retry
}

// Get correlation ID for support
if (appError.correlationId) {
  console.log('Reference ID:', appError.correlationId);
}
```

## Error Response Format

Errors from the backend are automatically parsed:

```json
{
  "success": false,
  "error": {
    "code": "BUSINESS_ERROR",
    "message": "Insufficient product stock",
    "correlationId": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "context": {
      "productId": "123",
      "available": 5,
      "requested": 10
    }
  }
}
```

## Logging

Errors are automatically logged with context:

```typescript
{
  "name": "AppError",
  "message": "Insufficient product stock",
  "code": "BUSINESS_ERROR",
  "statusCode": 422,
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "context": {
    "productId": "123",
    "available": 5,
    "requested": 10
  },
  "additionalContext": {
    "action": "createOrder"
  },
  "userAgent": "Mozilla/5.0...",
  "url": "http://localhost:3000/checkout"
}
```

## Integration with Backend

This frontend error system works seamlessly with the backend structured error system:
- Parses backend error codes and correlation IDs
- Maintains error context from backend
- Maps HTTP status codes to error types
- Preserves error traceability

## Future: Sentry Integration

When ready to add Sentry:

```typescript
// lib/errorParser.ts
import * as Sentry from '@sentry/nextjs';

export function logError(error: AppError, context?: Record<string, any>): void {
  const errorLog = {
    ...error.toJSON(),
    additionalContext: context,
  };

  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      tags: {
        error_code: error.code,
        correlation_id: error.correlationId,
      },
      contexts: {
        custom: errorLog,
      },
    });
  }
}
```

## Benefits

✅ **Type-safe error handling** with TypeScript  
✅ **Consistent error structure** across the app  
✅ **Rich debugging context** with correlation IDs  
✅ **User-friendly error messages**  
✅ **Automatic error logging**  
✅ **Easy error type checking**  
✅ **Retry detection** for network errors  
✅ **Works with Next.js** server and client components  
✅ **Ready for Sentry** integration  
✅ **Production-ready** error tracking
