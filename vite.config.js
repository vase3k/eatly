import path from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
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
    convertWebp({
      inputDir: "dist",
      width: 1440,
      quality: 80,
      excludeFolder: [],
      excludeFilesPrefix: [],
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
