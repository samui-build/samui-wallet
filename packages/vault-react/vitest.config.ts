import { sharedConfig } from '@workspace/config-vitest'
import { defineProject, mergeConfig } from 'vitest/config'

export default mergeConfig(sharedConfig, defineProject({}))
