import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    // Local development runs on HTTP; production-only security headers prevent
    // the preview client runtime from attaching event handlers.
    if (process.env.NODE_ENV !== "production") return [];
    return [{
      source: "/(.*)",
      headers: [
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
      ],
    }];
  },
};

export default nextConfig;
