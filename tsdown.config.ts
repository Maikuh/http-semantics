import { defineConfig } from 'tsdown'

export default defineConfig({
	entry: ['./src/**/*.ts', '!**/*.test.ts'],
	target: 'ES2022',
	minify: true,
	platform: 'neutral',
	sourcemap: true,
	unbundle: true,
})
