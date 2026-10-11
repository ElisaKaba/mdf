import type {
  NextConfig,
} from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/(.*)",

        headers: [
          {
            key:
              "X-Content-Type-Options",
            value:
              "nosniff",
          },

          {
            key:
              "X-Frame-Options",
            value:
              "SAMEORIGIN",
          },

          {
            key:
              "Referrer-Policy",
            value:
              "strict-origin-when-cross-origin",
          },

          {
            key:
              "Permissions-Policy",
            value:
              [
                "camera=()",
                "microphone=()",
                "geolocation=()",
              ].join(", "),
          },

          {
            key:
              "X-DNS-Prefetch-Control",
            value:
              "on",
          },

          {
            key:
              "Strict-Transport-Security",
            value:
              "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;