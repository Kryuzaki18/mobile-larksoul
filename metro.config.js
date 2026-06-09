const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = mergeConfig(getDefaultConfig(__dirname), {
  resolver: {
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
