import { config } from "@workspace/config-eslint/base";
import { defineConfig, globalIgnores } from "eslint/config";

/** @type {import("eslint").Linter.Config} */
export default defineConfig([config, globalIgnores(['.output/', '.wxt/'])]);
