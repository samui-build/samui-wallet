module.exports = (api) => {
  api.cache(true)
  return {
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            buffer: '@craftzdog/react-native-buffer',
            crypto: 'react-native-quick-crypto',
            http: 'stream-http',
            https: 'https-browserify',
            'node:crypto': 'react-native-quick-crypto',
            'node:stream': 'readable-stream',
            pbkdf2: 'react-native-pbkdf2',
            stream: 'readable-stream',
          },
          extensions: ['.ios.js', '.android.js', '.ios.jsx', '.android.jsx', '.js', '.jsx', '.json', '.ts', '.tsx'],
          root: ['./'],
        },
      ],
      'react-native-worklets/plugin',
    ],
    presets: ['babel-preset-expo'],
  }
}
