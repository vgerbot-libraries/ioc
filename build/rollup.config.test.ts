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
            mainFields: ['module', 'browser', 'main'],
            extensions: ['.js', '.ts']
        }),
        commonjs({
            include: 'node_modules/**',
            ignore: [],
            sourceMap: false
        }),
        typescript({
            tsconfig: '__tests__/tsconfig.json',
            include: '**/*.ts',
            exclude: ['node_modules/**']
        })
    ]
};

export default rollupConfig;
