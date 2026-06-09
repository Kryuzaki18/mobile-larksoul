const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

const config = mergeConfig(defaultConfig, {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === 'react-native-gesture-handler/DrawerLayout') {
        return { filePath: path.resolve(__dirname, 'shims/DrawerLayout.js'), type: 'sourceFile' };
      }
      if (moduleName === 'react-native-gesture-handler/Swipeable') {
        return { filePath: path.resolve(__dirname, 'shims/Swipeable.js'), type: 'sourceFile' };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
});

module.exports = withNativeWind(config, { input: './global.css' });
