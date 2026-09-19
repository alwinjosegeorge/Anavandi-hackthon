// Vite configuration for TanStack Start & React:
// Includes TanStack Start, React, TailwindCSS, tsconfigPaths, and server SSR setup.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
