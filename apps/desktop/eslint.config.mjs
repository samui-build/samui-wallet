import { viteConfig } from '@workspace/config-eslint/vite'
import { defineConfig, globalIgnores } from 'eslint/config'

/** @type {import("eslint").Linter.Config} */
export default defineConfig([viteConfig, globalIgnores(['src-tauri/target/'])])
