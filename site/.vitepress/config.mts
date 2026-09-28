import { defineConfig, type DefaultTheme, type HeadConfig, type PageData } from "vitepress";

const REPO_URL = "https://github.com/Clementtang/jev-eval";
const SITE_URL = "https://clementtang.github.io/jev-eval/";
const CC_BY_URL = "https://creativecommons.org/licenses/by/4.0/";
const PAPER_PAGES: Record<string, { citationLanguage: string; inLanguage: string; markdown: string }> = {
  "paper.md": { citationLanguage: "zh-TW", inLanguage: "zh-Hant-TW", markdown: "paper.md" },
  "en/paper.md": { citationLanguage: "en", inLanguage: "en", markdown: "en/paper.md" },
};

// YAML turns an unquoted 2026-09-28 into a Date, so both shapes are accepted.
const isoDate = (value: unknown) => (value instanceof Date ? value.toISOString() : String(value)).slice(0, 10);

// Google Scholar reads the citation_* tags; search engines and agents read the JSON-LD.
// Every value comes from the paper frontmatter, so a new version needs no edit here.
function paperHead(pageData: PageData, pageUrl: string): HeadConfig[] {
  const page = PAPER_PAGES[pageData.relativePath];
  if (!page) return [];
  const { title, author, date, version } = pageData.frontmatter;
  const published = isoDate(date);
  const article = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    name: title,
    headline: title,
    author: { "@type": "Person", name: author },
    datePublished: published,
    version,
    inLanguage: page.inLanguage,
    license: CC_BY_URL,
    url: pageUrl,
    isBasedOn: REPO_URL,
  };
  return [
    ["meta", { name: "citation_title", content: title }],
    ["meta", { name: "citation_author", content: author }],
    ["meta", { name: "citation_publication_date", content: published.replaceAll("-", "/") }],
    ["meta", { name: "citation_language", content: page.citationLanguage }],
    ["link", { rel: "alternate", type: "text/markdown", href: SITE_URL + page.markdown }],
    ["script", { type: "application/ld+json" }, JSON.stringify(article)],
  ];
}

// Serialized into the client bundle as source text, so the function must not use outer variables.
// Intl.Segmenter splits Chinese into words; the default tokenizer would index whole sentences.
function tokenize(text: string) {
  const segmenter = new Intl.Segmenter("zh-Hant", { granularity: "word" });
  return Array.from(segmenter.segment(text)).filter((s) => s.isWordLike).map((s) => s.segment);
}

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
  // public/ holds the papers as raw Markdown for agents; they are served as files, not pages.
  srcExclude: ["public/**"],
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
      ...paperHead(pageData, SITE_URL + path),
    ];
    return tags;
  },
  sitemap: { hostname: SITE_URL },
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
          { text: "題庫", link: "/explore" },
          replayNav({ menu: "互動重播", stance: "同題對照", portrait: "同題對照（直式短版）", race: "速度對照" }),
        ],
        outline: { label: "本頁目錄", level: [2, 3] },
        docFooter: { prev: false, next: false },
        returnToTopLabel: "回到頁首",
        sidebarMenuLabel: "選單",
        langMenuLabel: "切換語言",
        notFound: { title: "找不到這個頁面", quote: "網址可能打錯了，或頁面已經移動。", linkText: "回到首頁" },
        footer: {
          message: `文字與資料 <a href="${CC_BY_URL}">CC BY 4.0</a>，程式 <a href="${REPO_URL}/blob/main/LICENSE">MIT</a>`,
        },
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
          { text: "Items", link: "/en/explore" },
          replayNav({ menu: "Replays", stance: "Stance comparison", portrait: "Stance comparison (portrait, short)", race: "Speed race" }),
        ],
        outline: { label: "On this page", level: [2, 3] },
        docFooter: { prev: false, next: false },
        footer: {
          message: `Text and data <a href="${CC_BY_URL}">CC BY 4.0</a>, code <a href="${REPO_URL}/blob/main/LICENSE">MIT</a>`,
        },
      },
    },
  },
  themeConfig: {
    socialLinks: [{ icon: "github", link: REPO_URL }],
    search: {
      provider: "local",
      options: {
        miniSearch: { options: { tokenize }, searchOptions: { combineWith: "AND" } },
        locales: {
          root: {
            translations: {
              button: { buttonText: "搜尋", buttonAriaLabel: "搜尋" },
              modal: {
                displayDetails: "顯示詳細清單",
                resetButtonTitle: "清除搜尋",
                backButtonTitle: "關閉搜尋",
                noResultsText: "找不到結果",
                footer: {
                  selectText: "選擇",
                  selectKeyAriaLabel: "Enter",
                  navigateText: "切換",
                  navigateUpKeyAriaLabel: "向上鍵",
                  navigateDownKeyAriaLabel: "向下鍵",
                  closeText: "關閉",
                  closeKeyAriaLabel: "Esc",
                },
              },
            },
          },
          en: {
            translations: {
              button: { buttonText: "Search", buttonAriaLabel: "Search" },
              modal: {
                displayDetails: "Display detailed list",
                resetButtonTitle: "Reset search",
                backButtonTitle: "Close search",
                noResultsText: "No results for",
              },
            },
          },
        },
      },
    },
  },
});
