import { RollupOptions } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

const rollupConfig: RollupOptions = {
    output: {
        sourcemap: true
    },
    plugins: [
        nodeResolve({
            mainFields: ['module', 'browser', 'main'],
            extensions: ['.js', '.ts']
        }),
        commonjs({
            include: 'node_modules/**',
            ignore: [],
            sourceMap: false
        }),
        typescript({
            tsconfig: 'tsconfig.test.json',
            include: '*.ts',
            exclude: ['node_modules/**'],
            sourceMap: true,
            inlineSourceMap: true
        }),
        {
            name: 'PrintError',
            buildEnd(err) {
                if (err) {
                    console.error('Rollup Error: ', err);
                }
            }
        }
    ]
};

export default rollupConfig;
