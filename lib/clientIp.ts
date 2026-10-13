// The shopper's IP address as reported by the hosting proxy. On Vercel both headers are set by
// Vercel itself (a shopper cannot spoof them), and the API only trusts the value when it arrives
// with the storefront's secret key. Returns undefined when neither header is present (local dev).
export function clientIpFrom(headers: Headers): string | undefined {
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || undefined;
}
