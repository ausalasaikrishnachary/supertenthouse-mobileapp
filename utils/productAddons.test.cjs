const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

function load(relative, mocks = {}) {
  const source = fs.readFileSync(path.join(__dirname, relative), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true } }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)(id => mocks[id] || require(id), module, module.exports);
  return module.exports;
}
const { normalizeProductAddons } = load('productAddons.ts');
const { ProductAddons } = load('../components/ProductAddons.tsx', {
  'react-native': { View: 'div', Text: ({ accessibilityRole, ...props }) => React.createElement('span', props), Image: 'img', StyleSheet: { create: value => value } },
});
const fixture = { id: 1, addon_name: 'Extra Flowers', price: '5000.00', description: 'Fresh flowers', is_active: 1 };
test('normalizes product associations and numeric prices', () => {
  const [addon] = normalizeProductAddons([fixture]);
  assert.equal(addon.name, 'Extra Flowers');
  assert.equal(addon.price, 5000);
});
test('ignores inactive, duplicate, and malformed records', () => {
  assert.equal(normalizeProductAddons([fixture, fixture, { ...fixture, id: 2, is_active: 0 }, { id: 3 }, null]).length, 1);
  assert.deepEqual(normalizeProductAddons(undefined), []);
});
test('renders associated names, descriptions and prices', () => {
  const html = renderToStaticMarkup(React.createElement(ProductAddons, { addons: normalizeProductAddons([fixture]), imageUrl: value => value }));
  assert.match(html, /Available Add-ons/);
  assert.match(html, /Extra Flowers/);
  assert.match(html, /Fresh flowers/);
  assert.match(html, /5,000/);
});
test('a product without associations shows no section or previous product data', () => {
  const html = renderToStaticMarkup(React.createElement(ProductAddons, { addons: [], imageUrl: value => value }));
  assert.equal(html, '');
  assert.deepEqual(normalizeProductAddons([]), []);
});
