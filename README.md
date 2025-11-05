# Samui Wallet

Open Source Solana wallet and toolbox for builders 🏟 Cypherpunk Hackathon

[Read more about the project](https://x.com/SamuiBuild/status/1972798359024066578)

![Samui Wallet Demo](demo.gif)

## Requirements

- [Bun](https://github.com/samui-build/samui-wallet/blob/main/.bun-version)
- [FNM](https://github.com/Schniz/fnm) or [NVM](https://github.com/nvm-sh/nvm)

## Installation

```bash
git clone git@github.com:samui-build/samui-wallet.git
cd samui-wallet
fnm use # or nvm use
bun install
cp apps/web/.env.example apps/web/.env
bun dev
```

## Commands

- [https://github.com/samui-build/samui-wallet/blob/main/package.json#L32](https://github.com/samui-build/samui-wallet/blob/main/package.json#L32)

## Development

- API: [http://localhost:8787](http://localhost:8787)
- CLI: `bun watch` will run the CLI
- Desktop: [http://localhost:1420](http://localhost:1420)
- Extension: `bun dev` will automatically open a browser window with the extension installed.
- Mobile: `bun dev` will build and deploy the app to your chosen device
- Web: [http://localhost:5173](http://localhost:5173)
- Site: [http://localhost:4321](http://localhost:4321)

## Production

- API: [https://api.samui.build](https://api.samui.build)
- CLI: Coming soon
- Desktop: Coming soon
- Extension: Coming soon
- Mobile: Coming soon
- Web: [https://wallet.samui.build](https://wallet.samui.build)
- Site: [https://samui.build](https://samui.build)
