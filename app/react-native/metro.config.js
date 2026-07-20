const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname, 'src'),
};
config.watchFolders = [path.resolve(__dirname, 'src')];

// Native-only modules have no web build. When bundling for web, redirect them
// to no-op shims so the app can run in a browser for local testing.
const webShims = {
  '@invertase/react-native-apple-authentication': path.resolve(__dirname, 'src/shims/web-apple-auth.js'),
  '@react-native-google-signin/google-signin': path.resolve(__dirname, 'src/shims/web-google-signin.js'),
  '@react-native-firebase/app': path.resolve(__dirname, 'src/shims/web-firebase.js'),
  '@react-native-firebase/auth': path.resolve(__dirname, 'src/shims/web-firebase.js'),
};

const defaultResolve = require('metro-resolver').resolve;
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform, ...rest) => {
  if (platform === 'web' && webShims[moduleName]) {
    return defaultResolve({ ...context, resolveRequest: originalResolveRequest }, webShims[moduleName], platform);
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform, ...rest);
  }
  return defaultResolve({ ...context, resolveRequest: undefined }, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
