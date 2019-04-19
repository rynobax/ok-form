import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import pkg from './package.json';

const input = './src/index.ts';

const extensions = ['.ts', '.tsx'];

const defaultPlugins = [
  typescript(),
  babel({ extensions }),
  sourceMaps(),
  sizeSnapshot(),
];

const getPath = (env, format) => {
  let path = './dist/';
  path += pkg.name;
  path += `.${format}`;
  if(env === 'production') path += '.min';
  path += '.js';
  return path;
}

const buildUmd = ({ env }) => ({
  input,
  output: {
    name: 'OkForm',
    format: 'umd',
    sourcemap: true,
    file: getPath(env, 'umd'),
    exports: 'named',
  },

  plugins: [
    ...defaultPlugins,
    env === 'production' &&
      terser({
        sourcemap: true,
        output: { comments: false },
        warnings: true,
        ecma: 5,
        toplevel: false,
      }),
  ],
});

const buildCjs = ({ env }) => ({
  input,
  output: {
    file: getPath(env, 'cjs'),
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    ...defaultPlugins,
    env === 'production' &&
      terser({
        sourcemap: true,
        output: { comments: false },
        warnings: true,
        ecma: 5,
        toplevel: true,
      }),
  ],
});

export default [
  buildUmd({ env: 'production' }),
  buildUmd({ env: 'development' }),
  buildCjs({ env: 'production' }),
  buildCjs({ env: 'development' }),
  {
    input,
    output: [
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [...defaultPlugins],
  },
];
