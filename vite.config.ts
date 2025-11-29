// vite.config.ts
import { quickpickle, type QuickPickleConfigSetting } from "quickpickle";
const qpOptions: QuickPickleConfigSetting = {};

export default {
  plugins: [quickpickle(qpOptions)],
  test: {
    include: ["features/*.feature"],
    setupFiles: ["features/*.steps.ts"],
  },
};
