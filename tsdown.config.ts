import { defineConfig } from 'tsdown'

export default defineConfig({
	entry: ['./src/**/*.ts', '!**/*.test.ts'],
	target: 'ES2023',
	platform: 'neutral',
	sourcemap: true,
	unbundle: true,
	dts: true,
})
