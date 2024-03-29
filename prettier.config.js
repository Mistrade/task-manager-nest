module.exports = {
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'es5',
  code: 100,
  before: true,
  after: true,
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrder: [
    '^@core/(.*)$',
    '^@src/(.*)$',
    '^@components/(.*)$',
    '^@pages/(.*)$',
    '^@planner/(.*)$',
    '^@api/(.*)$',
    '^[./]',
  ],
};