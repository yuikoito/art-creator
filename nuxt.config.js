require("dotenv").config();
const { API_BASE_URL, API_OGP_URL } = process.env;
// const userLanguage = window.navigator.language;

export default {
  /*
   ** Headers of the page
   */
  head: {
    title: "絵画ツクール",
    htmlAttrs: {
      lang: "ja",
      prefix: "og: http://ogp.me/ns#",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content:
          "You can easily create an Art with your picture.\r\n絵画をかんたんに作れるサービスです",
      },
      {
        hid: "og:site_name",
        property: "og:site_name",
        content: "ArtCreator\r\n絵画ツクール",
      },
      { hid: "og:type", property: "og:type", content: "article" },
      {
        hid: "og:url",
        property: "og:url",
        content: "https://art-creator.net",
      },
      {
        hid: "og:title",
        property: "og:title",
        content: "ArtCreator\r\n絵画ツクール",
      },
      {
        hid: "og:description",
        property: "og:description",
        content:
          "You can easily create an Art with your picture.\r\n絵画をかんたんに作れるサービスです",
      },
      {
        hid: "og:image",
        property: "og:image",
        content: "https://yuilog.xyz/wp-content/uploads/2021/06/background.png",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:image",
        content: "https://yuilog.xyz/wp-content/uploads/2021/06/background.png",
      },
      { name: "twitter:site", content: "@yui_active" },
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "https://yuilog.xyz/wp-content/uploads/2021/06/favicon.png",
      },
    ],
  },

  target: "static",

  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["@/plugins/i18n.js"],

  components: true,

  env: {
    API_BASE_URL,
    API_OGP_URL,
  },
  buildModules: ["@nuxtjs/tailwindcss", "@aceforth/nuxt-optimized-images"],
  optimizedImages: {
    optimizeImages: true,
    optimizeImagesInDev: true,
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/dotenv",
    ["cookie-universal-nuxt", { parseJSON: false }],
  ],

  /*
   ** Build configuration
   */
  build: {},
};
