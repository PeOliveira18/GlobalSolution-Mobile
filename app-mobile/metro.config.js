// Configuração do Metro (bundler do Expo).
// Só é necessária para o expo-sqlite funcionar no navegador (Expo Web):
// o SQLite roda como WebAssembly (.wasm) e precisa de SharedArrayBuffer,
// que o navegador só libera com os dois cabeçalhos abaixo.
// No Android e no iOS (Expo Go) nada disso muda.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

if (!config.resolver.assetExts.includes('wasm')) {
  config.resolver.assetExts.push('wasm');
}

const enhanceMiddleware = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (middleware, metroServer) => {
  const enhancedMiddleware = enhanceMiddleware ? enhanceMiddleware(middleware, metroServer) : middleware;
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    return enhancedMiddleware(req, res, next);
  };
};

module.exports = config;
