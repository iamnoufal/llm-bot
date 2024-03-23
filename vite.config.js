import { defineConfig } from "vite";

export default defineConfig({
  // https://stackoverflow.com/a/75953479
  optimizeDeps: {
    exclude: ["@google/generative-ai"],
  },
  base: "https://project.noufal.dev/llm-bot/"
});
