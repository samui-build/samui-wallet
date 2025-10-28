// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Samui',
      favicon: '/favicon.svg',
      logo: {
        src: './src/assets/logo.svg',
      },
      social: [
        {
          icon: 'discord',
          label: 'Discord',
          href: 'https://samui.build/go/discord',
        },
        {
          icon: 'x.com',
          label: 'X / Twitter',
          href: 'https://samui.build/go/x',
        },
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://samui.build/go/github',
        },
      ],

      customCss: ['./src/styles/global.css'],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
