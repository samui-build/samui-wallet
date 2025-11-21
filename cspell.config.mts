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
  ignorePaths: ['Cargo.toml'],
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
    'cypherpunk',
    'devnet',
    'ellipsify',
    'hackathon',
    'hdkey',
    'helius',
    'lamport',
    'lamports',
    'localnet',
    'mainnet',
    'nums',
    'rtishchev',
    'samui',
    'seti',
    'solscan',
    'surfpool',
    'testnet',
    'tobeycodes',
    'unruggable',
    'vitaly',
    'wordlist',
    'wordlists',
    // Spanish
    'mnemónica',
    'redirecciona',
  ],
}

export default config
