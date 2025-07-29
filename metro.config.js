const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const {assetExts, sourceExts} = defaultConfig.resolver;
/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  // server: {
  //     port: 8081,
  //     host: '0.0.0.0', //호스트 변경
  // }
};
module.exports = mergeConfig(defaultConfig, config);

/**
 * 특정 포트 실행 명령어
 * npx react-native start --port=8081
 */
