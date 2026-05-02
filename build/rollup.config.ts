import path from 'node:path';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import type { InputPluginOption, OutputOptions, RollupOptions } from 'rollup';
import dts from 'rollup-plugin-dts';
import typescript from 'rollup-plugin-typescript2';

type CompatiblePluginOption = InputPluginOption;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require(path.resolve(process.cwd(), 'package.json'));

const outputConfig = [
    [pkg.browser, 'umd'],
    [pkg.module, 'es'],
    [pkg.main, 'cjs']
].map(confs => createOutputConfig(confs[0], confs[1]));

const jsConfig: RollupOptions = {
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
        typescript({
            tsconfigOverride: {
                compilerOptions: {
                    composite: false,
                    declaration: false,
                    declarationMap: false
                }
            }
        })
    ],
    external: /node_modules/
};

const dtsConfig: RollupOptions = {
    input: 'src/index.ts',
    output: {
        file: path.resolve(process.cwd(), 'dist/index.d.ts'),
        format: 'es'
    },
    plugins: [
        dts({
            tsconfig: path.resolve(process.cwd(), 'tsconfig.json'),
            compilerOptions: {
                composite: false,
                types: ['node']
            }
        }) as CompatiblePluginOption
    ],
    external: /node_modules/
};

export default [jsConfig, dtsConfig];

function createOutputConfig(file: string, format: string, cfg: OutputOptions = {}): OutputOptions {
    return Object.assign(
        {
            file: path.resolve(process.cwd(), file),
            format,
            sourcemap: 'inline',
            name: pkg.library,
            exports: 'named'
        } as OutputOptions,
        cfg || {}
    );
}
