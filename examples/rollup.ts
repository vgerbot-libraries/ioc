import { RollupOptions } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import serve from 'rollup-plugin-serve';
import html from '@rollup/plugin-html';
import pluginDelete from 'rollup-plugin-delete';
import livereload from 'rollup-plugin-livereload';
import fs from 'fs';
import path from 'path';

const examples = fs.readdirSync('./examples').filter(it => {
    const stat = fs.statSync(`./examples/${it}`);
    return stat.isDirectory();
});

const rollupOptions: RollupOptions[] = examples.map(expName => {
    return {
        input: path.resolve(`examples/${expName}/index.ts`),
        output: {
            dir: `examples_dist/${expName}`,
            sourcemap: true,
            format: 'module'
        },
        watch: {
            clearScreen: true,
            include: /src|examples/
        },
        plugins: [
            nodeResolve({
                mainFields: ['main', 'browser', 'jsnext']
            }),
            commonjs({
                include: 'node_modules/**',
                ignore: [],
                sourceMap: true
            }),
            typescript({}),
            html({
                title: `@vgerbot/ioc example -- ${expName}`,
                publicPath: `/${expName}/`
            }),
            serve({
                contentBase: './examples_dist/'
            }),
            livereload({
                watch: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'examples'),
                    path.resolve(__dirname, 'examples_dist')
                ],
                exts: ['.ts', '.html', '.js']
            }),
            pluginDelete({
                targets: `./examples_dist/(${expName})/**`
            })
        ]
    };
});

export default rollupOptions;
