// https://nuxt.com/docs/api/configuration/nuxt-config
import {resolve} from "path";
import svgLoader from 'vite-svg-loader';
export default defineNuxtConfig({
  nitro: {
    output: {
      publicDir: '.output/public'
    }
  },
  devtools: { enabled: true },

  alias: {
    assets: "/<rootDir>/assets",
  },
  compatibilityDate: "2024-07-03",
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ["@ant-design-vue/nuxt", "nuxt-highcharts"],
  css: ["~/assets/scss/main.scss"],
  antd: {
    // Options
  },
})