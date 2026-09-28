import { defineConfig, type DefaultTheme, type HeadConfig } from "vitepress";

const REPO_URL = "https://github.com/Clementtang/jev-eval";
const SITE_URL = "https://clementtang.github.io/jev-eval/";

// The replays are plain HTML files in public/, outside the VitePress router, so they need a full
// page load (target _self) instead of client-side navigation.
function replayNav(labels: { stance: string; portrait: string; race: string; menu: string }): DefaultTheme.NavItem {
  return {
    text: labels.menu,
    items: [
      { text: labels.stance, link: "/replay/stance.html", target: "_self" },
      { text: labels.portrait, link: "/replay/stance.html?layout=portrait&cut=short", target: "_self" },
      { text: labels.race, link: "/replay/race.html", target: "_self" },
    ],
  };
}

export default defineConfig({
  base: "/jev-eval/",
  cleanUrls: true,
  // Light theme only: no toggle and no following the system dark setting.
  appearance: false,
  lastUpdated: false,
  // breaks: the paper's byline puts name, affiliation and version on separate source lines.
  markdown: { math: true, breaks: true },
  // head entries are emitted verbatim, so the favicon path carries the base itself.
  head: [
    ["meta", { name: "theme-color", content: "#1f8a78" }],
    ["link", { rel: "icon", type: "image/svg+xml", href: "/jev-eval/favicon.svg" }],
  ],
  // Social previews from Threads, X and Facebook read these per page.
  transformHead({ pageData, siteData, title }) {
    const locale = pageData.relativePath.startsWith("en/") ? siteData.locales.en : siteData.locales.root;
    const description = pageData.frontmatter.description ?? locale.description ?? siteData.description;
    const path = pageData.relativePath.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, "");
    const tags: HeadConfig[] = [
      ["meta", { property: "og:type", content: "article" }],
      ["meta", { property: "og:title", content: title }],
      ["meta", { property: "og:description", content: description }],
      ["meta", { property: "og:url", content: SITE_URL + path }],
      ["meta", { name: "twitter:card", content: "summary" }],
    ];
    return tags;
  },
  locales: {
    root: {
      label: "繁體中文",
      lang: "zh-Hant-TW",
      title: "語言模型台灣主權立場稽核",
      description:
        "以主張、強迫選擇與實務標籤三種工具，稽核 TypeSafe Jev 與五個生成式模型在台灣主權議題上的判斷。預印本，未經同儕審查。",
      themeConfig: {
        siteTitle: "台灣主權立場稽核",
        nav: [
          { text: "論文", link: "/paper" },
          replayNav({ menu: "互動重播", stance: "同題對照", portrait: "同題對照（直式短版）", race: "速度對照" }),
        ],
        outline: { label: "本頁目錄", level: [2, 3] },
        docFooter: { prev: false, next: false },
        returnToTopLabel: "回到頁首",
        sidebarMenuLabel: "選單",
        langMenuLabel: "切換語言",
        notFound: { title: "找不到這個頁面", quote: "網址可能打錯了，或頁面已經移動。", linkText: "回到首頁" },
      },
    },
    en: {
      label: "English",
      lang: "en",
      link: "/en/",
      title: "Auditing Language Models on Taiwan's Sovereignty",
      description:
        "An audit of TypeSafe Jev and five generative models on Taiwan's sovereignty with claims, forced choices and practical labels. Preprint, not peer reviewed.",
      themeConfig: {
        // Short enough for the phone navigation bar; the full title stays in <title>.
        siteTitle: "Taiwan Stance Audit",
        nav: [
          { text: "Paper", link: "/en/paper" },
          replayNav({ menu: "Replays", stance: "Stance comparison", portrait: "Stance comparison (portrait, short)", race: "Speed race" }),
        ],
        outline: { label: "On this page", level: [2, 3] },
        docFooter: { prev: false, next: false },
      },
    },
  },
  themeConfig: {
    socialLinks: [{ icon: "github", link: REPO_URL }],
  },
});
