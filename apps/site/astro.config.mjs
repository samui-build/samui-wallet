// @ts-check

import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      components: {
        Footer: './src/components/SiteFooter.astro',
      },
      customCss: ['./src/styles/global.css'],
      editLink: {
        baseUrl: 'https://github.com/samui-build/samui-wallet/edit/main/apps/site',
      },
      favicon: '/favicon.svg',
      logo: {
        dark: './src/assets/logo-dark.svg',
        light: './src/assets/logo-light.svg',
        replacesTitle: true,
      },
      social: [
        {
          href: 'https://samui.build/go/discord',
          icon: 'discord',
          label: 'Discord',
        },
        {
          href: 'https://samui.build/go/github',
          icon: 'github',
          label: 'GitHub',
        },
        {
          href: 'https://samui.build/go/x',
          icon: 'x.com',
          label: 'X / Twitter',
        },
      ],
      title: 'Samui',
    }),
  ],
  redirects: {
    // These redirects also exist in /public/_redirects.
    '/go/discord': {
      destination: 'https://discord.gg/x6WcQ7bVgF',
      status: 302,
    },
    '/go/github': {
      destination: 'https://github.com/samui-build/samui-wallet',
      status: 302,
    },
    '/go/x': {
      destination: 'https://x.com/SamuiBuild',
      status: 302,
    },
  },
  site: 'https://samui.build',
  vite: {
    // @ts-expect-error Astro 5 uses Vite 6, we use Vite 7 in our monorepo
    plugins: [tailwindcss()],
  },
})
