import { defineConfig } from "@tanstack/start/config";
import viteTsConfigPaths from "vite-tsconfig-paths";

type Plugin = Exclude<
  Exclude<
    Exclude<Parameters<typeof defineConfig>[0], undefined>["vite"],
    (() => unknown) | undefined
  >["plugins"],
  undefined
>[number];

export default defineConfig({
  server: {
    preset: "netlify",
  },
  vite: {
    plugins: [viteTsConfigPaths() as Plugin],
  },
});
