// Thin wrapper to allow ESLint to load config when package.json sets "type":"module"
// Use the CommonJS .cjs file as the source of truth
try {
  // eslint-disable-next-line node/global-require
  module.exports = require('./.eslintrc.cjs');
} catch (e) {
  // Fallback: export an empty config to avoid crashing
  module.exports = {};
}
