/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import path from "node:path";
import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);
// Always render on the GPU (Sachin, 2026-11-02): Chrome draws frames with ANGLE on the GTX 1650.
// H.264 encoding stays on the CPU (Remotion hardware encoding is macOS-only). 10 of 12 cores.
// The laptop switches GPUs per app: without a Windows preference Chrome drew on the Intel UHD (GTX at 0%).
// HKCU\Software\Microsoft\DirectX\UserGpuPreferences has <...>\chrome-headless-shell.exe = "GpuPreference=2;"
// (set 2026-11-02). Re-set it if node_modules/.remotion is reinstalled to a new path.
Config.setChromiumOpenGlRenderer("angle");
Config.setConcurrency(10);
// shadcn-style "@/..." imports: Remotion's bundler doesn't read tsconfig paths.
Config.overrideBundlerConfig((config) => {
  const c = enableTailwind(config);
  return {
    ...c,
    resolve: {
      ...c.resolve,
      alias: { ...c.resolve?.alias, "@": path.join(process.cwd(), "src") },
    },
  };
});
