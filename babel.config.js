module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      'react-native-worklets/plugin',
    ],
  };
};

// Reanimated configuration to disable strict mode warnings
// This is added as a comment since the actual config should be in the app code
// In your app code, you can add:
// import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
// configureReanimatedLogger({ level: ReanimatedLogLevel.Warn });
