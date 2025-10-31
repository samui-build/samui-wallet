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
    }
  },
  vite: {
    // @ts-expect-error Astro 5 uses Vite 6, we use Vite 7 in our monorepo
    plugins: [tailwindcss()],
  },
})
