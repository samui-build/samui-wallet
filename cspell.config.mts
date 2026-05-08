import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { CSpellSettings } from 'cspell'

function findPackageJsonFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((e) => {
    if (e.name === 'node_modules') return []
    const full = join(directory, e.name)
    return e.isDirectory() ? findPackageJsonFiles(full) : e.name === 'package.json' ? [full] : []
  })
}

function getAllDependencies(pkgPath: string): string[] {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  return [pkg.dependencies, pkg.devDependencies, pkg.peerDependencies, pkg.optionalDependencies, pkg.catalog]
    .flatMap((deps) => Object.keys(deps || {}))
    .flatMap((dep) => dep.replace('@', '').split(/[/-]/))
}

export function getPackageNames(): string[] {
  const allDeps = new Set<string>(findPackageJsonFiles('.').flatMap(getAllDependencies))
  return [...allDeps].sort()
}

const config: CSpellSettings = {
  dictionaries: ['fullstack', 'html', 'css'],
  ignorePaths: ['drizzle'],
  import: ['@cspell/dict-es-es/cspell-ext.json'],
  overrides: [
    {
      filename: '**/es/*.json',
      language: 'en, es',
    },
  ],
  useGitignore: true,
  words: [
    ...getPackageNames(),
    // English
    'arweave',
    'beeman',
    'blockhash',
    'bootsplash',
    'bunx',
    'cipherparams',
    'ciphertext',
    'cooldown',
    'cypherpunk',
    'datetimepicker',
    'devnet',
    'dklen',
    'ellipsify',
    'hackathon',
    'hdkey',
    'helius',
    'kdfparams',
    'lamport',
    'lamports',
    'lironer',
    'localnet',
    'mainnet',
    'metaplex',
    'netinfo',
    'nvmrc',
    'nums',
    'rtishchev',
    'samui',
    'seti',
    'sidepanel',
    'skia',
    'solscan',
    'surfpool',
    'sysvar',
    'testnet',
    'tobeycodes',
    'unimodules',
    'unruggable',
    'unstake',
    'viewpager',
    'vitaly',
    'wordlist',
    'wordlists',
    'worklets',
    // Spanish
    'mnemónica',
    'redirecciona',
  ],
}

export default config
