<h1 align="center">
  Samui Wallet
</h1>

<p align="center">
  Open Source Solana wallet and toolbox for builders 🏟 Cypherpunk Hackathon
</p>

<p align="center">
  <a href="https://x.com/SamuiBuild/status/1972798359024066578">Read more about the project</a>
</p>

![Samui Wallet Demo](demo.gif)

## Development

### Environment setup

1. Install [NodeJS](https://nodejs.org/en)
2. Install [Bun](https://bun.com/docs/installation)
3. Install [FNM](https://github.com/Schniz/fnm#installation) or [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)

Clone and prepare this repo locally:

```shell
git clone https://github.com/samui-build/samui-wallet/
cd samui-wallet
fnm use # or nvm use
bun install
cp apps/web/.env.example apps/web/.env
bun dev
```

### Apps

The `bun dev` command above starts all apps. To run individual apps: `cd apps/<app-name> && bun dev`

| App       | Local URL                               | Notes                   |
| --------- | --------------------------------------- | ----------------------- |
| Web       | [localhost:5173](http://localhost:5173) | Main wallet interface   |
| Desktop   | [localhost:1420](http://localhost:1420) | Tauri desktop app       |
| Extension | Opens automatically                     | Browser extension       |
| Mobile    | Device/emulator                         | React Native app        |
| API       | [localhost:8787](http://localhost:8787) | Cloudflare Worker       |
| Site      | [localhost:4321](http://localhost:4321) | Documentation site      |
| CLI       | N/A                                     | Use `bun watch` instead |

## Production

| App       | URL                                              | Status      |
| --------- | ------------------------------------------------ | ----------- |
| Web       | [wallet.samui.build](https://wallet.samui.build) | Live        |
| API       | [api.samui.build](https://api.samui.build)       | Live        |
| Site      | [samui.build](https://samui.build)               | Live        |
| Desktop   | —                                                | Coming soon |
| Extension | —                                                | Coming soon |
| Mobile    | —                                                | Coming soon |
| CLI       | —                                                | Coming soon |
