const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Allow the `@/*` -> src/* alias (also handled by tsconfig paths).
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname, 'src'),
};
config.watchFolders = [path.resolve(__dirname, 'src')];

module.exports = config;
