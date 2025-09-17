// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Ensure that Metro can resolve .css files
config.resolver.sourceExts.push('css');

// Add support for gesture handler
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-gesture-handler': 'react-native-gesture-handler',
};

module.exports = withNativeWind(config, { input: './global.css' });
