// The fonts-free entry keeps the bundled Inter files out of the site; the stack is set in custom.css.
import DefaultTheme from "vitepress/theme-without-fonts";
import type { Theme } from "vitepress";
import ItemExplorer from "./components/ItemExplorer.vue";
import SensitivityLab from "./components/SensitivityLab.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("ItemExplorer", ItemExplorer);
    app.component("SensitivityLab", SensitivityLab);
  },
} satisfies Theme;
