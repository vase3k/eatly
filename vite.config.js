import path from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { meta } from "vite-plugin-meta-tags";
import vitePluginFaviconsInject from "vite-plugin-favicons-inject";
import convertWebp from "./src/js/services/convertWebp";

const baseName = `/${path.basename(process.cwd())}`;

export default defineConfig({
  base: baseName + "/dist/",
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        index: "index.html",
      },
    },
  },

  plugins: [
    tailwindcss(),
    meta({
      title: "Eatly",
      description: "Enjoy Foods All Over The World",
      url: "https://eatly.by/",
      img: "/images/meta-og-image.jpg",
      color: "#ffffff",
    }),
    vitePluginFaviconsInject("src/favicon/favicon.png", {
      background: "#fff",
      path: "assets/fav",
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: false,
        favicons: true,
        windows: false,
        yandex: true,
      },
      appName: "Eatly",
      appShortName: "Eatly",
      appDescription: "Enjoy Foods All Over The World",
    }),
    convertWebp({
      inputDir: "dist",
      width: 1440,
      quality: 80,
      excludeFolder: ["images"],
      excludeFilesPrefix: [
        "android-chrome",
        "apple-touch-icon",
        "favicon-",
        "yandex-browser",
      ],
    }),
    // legacy({
    // 	targets: ["defaults"],
    // }),
  ],
  resolve: {
    alias: [
      {
        find: "@b",
        replacement: path.resolve(__dirname, "src/sass/blocks"),
      },
      {
        find: "@h",
        replacement: path.resolve(__dirname, "src/sass/helpers"),
      },
      {
        find: "@m",
        replacement: path.resolve(__dirname, "src/img"),
      },
      {
        find: "@s",
        replacement: path.resolve(__dirname, "src/sass"),
      },
    ],
  },
});
