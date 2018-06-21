import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

export default [
  {
    input: 'src/index.js',
    external: [
      'babel-runtime/core-js/set',
      'babel-runtime/core-js/array/from',
    ],
    output: [
      { file: pkg.main, format: 'cjs' },
    ],
    plugins: [
      babel({ exclude: ['node_modules/**'] }),
      uglify(),
    ],
  },
];
