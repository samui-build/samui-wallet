// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')
const path = require('node:path')
const { withUniwindConfig } = require('uniwind/metro')

const config = getDefaultConfig(__dirname)

// Apply uniwind config first
const uniwindConfig = withUniwindConfig(config, {
  // relative path to your global.css file (from previous step)
  cssEntryFile: './src/global.css',
  // (optional) path where we gonna auto-generate typings
  // defaults to project's root
  dtsFile: './src/uniwind-types.d.ts',
})

// Ensure React resolves from the mobile app's node_modules first
// This must be applied after uniwind config to ensure it takes precedence
const originalResolveRequest = uniwindConfig.resolver.resolveRequest
uniwindConfig.resolver = {
  ...uniwindConfig.resolver,
  resolveRequest: (context, moduleName, platform) => {
    // Force React to resolve from local node_modules to match react-native-renderer version
    if (moduleName === 'react' || moduleName.startsWith('react/')) {
      try {
        const localReactPath = require.resolve(moduleName, {
          paths: [path.resolve(__dirname, 'node_modules')],
        })
        return {
          filePath: localReactPath,
          type: 'sourceFile',
        }
      } catch {
        // Fall through to default resolution if local resolve fails
      }
    }
    // Use default resolution for other modules
    if (originalResolveRequest) return originalResolveRequest(context, moduleName, platform)
    return context.resolveRequest(context, moduleName, platform)
  },
}

module.exports = uniwindConfig
