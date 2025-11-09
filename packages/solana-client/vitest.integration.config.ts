import { integrationConfig } from '@workspace/config-vitest/integration'
import { defineProject, mergeConfig } from 'vitest/config'

export default mergeConfig(integrationConfig, defineProject({}))
