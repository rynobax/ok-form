module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRegex: '(src/.*(test|spec))\\.(ts|js)x?$',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/tsBuild/'],
};
