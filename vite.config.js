import path from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import webfontDownload from "vite-plugin-webfont-dl";
import { meta } from "vite-plugin-meta-tags";
import vitePluginFaviconsInject from "vite-plugin-favicons-inject";
import convertWebp from "./src/js/services/convertWebp";

const baseName = `/${path.basename(process.cwd())}`;

export default defineConfig({
  base: baseName + "/dist/",
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
      },
    },
  },

  plugins: [
    tailwindcss(),
    webfontDownload(
      [
        "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100.." +
          "900&family=Manrope:wght@200..800&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=" +
          "Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;" +
          "1,500;1,600;1,700;1,800;1,900&family=Public+Sans:ital,wght@0,100..900;1,100..900&family=Quicksand:wght@300..700&display=swap",
      ],
      {
        injectAsStyleTag: false,
        minifyCss: true,
        assetsSubfolder: "fonts",
      },
    ),
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
