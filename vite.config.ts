// vite.config.ts
import { quickpickle, type QuickPickleConfigSetting } from "quickpickle";
const qpOptions: QuickPickleConfigSetting = {};

export default {
  plugins: [quickpickle(qpOptions)],
  resolve: {
    alias: {
      "@": `${import.meta.dirname}/src`,
    },
  },
  test: {
    include: ["features/**/*.feature"],
    setupFiles: [
      "features/support/world.ts",
      "features/support/mockAdapter.ts",
      "features/steps/score.steps.ts",
    ],
  },
};
