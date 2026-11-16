// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    // .expo/ é gerado pelo Expo (tipos das rotas), não é código nosso.
    ignores: ['dist/*', '.expo/*'],
  },
]);
