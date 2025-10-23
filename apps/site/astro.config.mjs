// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Samui",
      favicon: "./src/assets/logo.svg",
      logo: {
        src: "./src/assets/logo.svg",
      },
      social: [
        {
          icon: "x.com",
          label: "X / Twitter",
          href: "https://x.com/SamuiBuild",
        },
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/samui-build/samui-wallet",
        },
      ],

      customCss: ["./src/styles/global.css"],

    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
