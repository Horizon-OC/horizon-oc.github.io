import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Horizon OC",
  head: [['link', { rel: 'icon', href: 'logo.png' }]],
  description: "An open source overclocking tool for Nintendo Switch consoles running Atmosphere custom firmware ",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local'
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guides', link: '/guide.md' },
      {
        text: 'Links',
        items: [
          { text: 'Original Mariko Guide', link: 'https://rentry.co/mariko' },
          { text: 'Page Source', link: 'https://github.com/Horizon-OC/horizon-oc.github.io' }
        ]
      }
    ],

    sidebar: [
      {
        text: 'Documentation',
        items: [
          {
            text: 'Getting Started',
            collapsed: false,
            items: [
              { text: 'Guide', link: '/guide.md' },
            ]
          },
          {
            text: 'Guides',
            collapsed: false,
            items: [
              { text: 'Mariko OC Guide', link: '/mariko.md' },
              { text: 'Erista OC Guide', link: '/erista.md' },
            ]
          },
          {
            text: 'Support',
            collapsed: false,
            items: [
              { text: 'Error Codes', link: './errors.md'},
              { text: 'Horizon OC Discord Server', link: 'https://discord.com/invite/vB7YMXctqh'},
              { text: '60FPS Discord Server', link: 'https://discord.com/invite/S3eX47dHsB'}
            ]
          },
          { text: 'Credits', link: '/credits.md' },
          { text: 'Frequently Asked Questions', link: '/faq.md' },
          { text: 'Integrations', link: '/integrations.md' },
          { text: 'Extras', link: '/extras.md' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Horizon-OC/Horizon-OC' },
      { icon: 'discord', link: 'https://discord.gg/g4gWKhxmFY' }
    ]
  }
})
