import { defineConfig } from 'vite'
import { extname, relative, resolve } from 'path'
import { fileURLToPath } from 'url'
import dtsPlugin from 'vite-plugin-dts'
import copy from 'rollup-plugin-copy'
import { glob } from 'glob'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [dtsPlugin({ include: ['library'] })],
    build: {
        outDir: 'package/dist',
        copyPublicDir: false,
        lib: {
            entry: resolve(__dirname, 'library/index.ts'),
            formats: ['es'],
        },
        rollupOptions: {
            input: Object.fromEntries(
                glob
                    .sync('library/**/!(*.d).{ts,tsx}')
                    .map((file) => [
                        relative(
                            'library',
                            file.slice(0, file.length - extname(file).length)
                        ),
                        fileURLToPath(new URL(file, import.meta.url)),
                    ])
            ),
            output: {
                assetFileNames: 'assets/[name][extname]',
                entryFileNames: '[name].js',
            },
            plugins: [
                copy({
                    targets: [
                        { src: 'package.json', dest: 'package' },
                        { src: 'LICENSE', dest: 'package' },
                    ],
                }),
            ],
        },
    },
})
