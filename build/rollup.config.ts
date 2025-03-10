import { OutputOptions, RollupOptions } from 'rollup';
import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require(path.resolve(process.cwd(), 'package.json'));

const outputConfig = [
    [pkg.browser, 'umd'],
    [pkg.module, 'es'],
    [pkg.main, 'cjs']
].map(confs => createOutputConfig(confs[0], confs[1]));

const rollupConfig: RollupOptions = {
    output: outputConfig,
    input: 'src/index.ts',
    plugins: [
        nodeResolve({
            mainFields: ['main', 'browser', 'jsnext']
        }),
        commonjs({
            include: 'node_modules/**',
            ignore: [],
            sourceMap: true
        }),
        typescript({})
    ],
    external: /node_modules/
};

export default rollupConfig;

function createOutputConfig(file: string, format: string, cfg: OutputOptions = {}): OutputOptions {
    return Object.assign(
        {
            file: path.resolve(process.cwd(), file),
            format,
            sourcemap: 'inline',
            name: pkg.library,
            exports: 'named',
            globals: {
                '@vgerbot/lazy': 'lazy'
            }
        } as OutputOptions,
        cfg || {}
    );
}
