import { defineConfig } from 'vite'
import NodeCGPlugin from 'vite-plugin-nodecg'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [NodeCGPlugin(), tsconfigPaths()],
})