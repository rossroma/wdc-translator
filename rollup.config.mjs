import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'wdc-translator',
      globals: {
        compromise: 'nlp' // 告诉 Rollup `compromise` 的全局变量名称是 `nlp`
      }
    },
    {
      file: 'dist/index.umd.min.js', // 压缩后的文件
      format: 'umd',
      name: 'wdc-translator',
      plugins: [terser()], // 使用 terser 插件压缩
      globals: {
        compromise: 'nlp' // 告诉 Rollup `compromise` 的全局变量名称是 `nlp`
      }
    }
  ],
  external: ['compromise'], // 告诉 Rollup `compromise` 是外部依赖
  plugins: [
    typescript({
      module: 'es2015',
    })
  ]
};