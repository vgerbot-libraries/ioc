import { RollupOptions } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

const rollupConfig: RollupOptions = {
    output: {
        sourcemap: true
    },
    plugins: [
        nodeResolve({
            mainFields: ['module', 'browser', 'main']
        }),
        commonjs({
            include: 'node_modules/**',
            ignore: [],
            sourceMap: false
        }),
        typescript({
            tsconfig: 'tsconfig.test.json'
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
