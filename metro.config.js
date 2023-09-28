const { getDefaultConfig } = require('expo/metro-config');
const defaultSourceExts = require('metro-config/src/defaults/defaults').sourceExts;

const sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json', 'svg', 'd.ts', 'mjs', 'cjs'].concat(defaultSourceExts);

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = {
  resolver: {
    sourceExts,
  },
  // Add any other configuration options you may need here
  // ...
};

