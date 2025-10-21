/** @type {import('next').NextConfig} */
const nextConfig = {
  // Constrain file tracing to this app to avoid resolving workspace-root toolchains
  outputFileTracingRoot: new URL('.', import.meta.url).pathname,
};

export default nextConfig;


