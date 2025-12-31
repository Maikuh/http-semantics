import { defineConfig } from 'tsdown'

export default defineConfig({
	entry: ['./src/**/*.ts'],
	target: 'ES2022',
	minify: true,
	platform: 'neutral',
	sourcemap: process.env.NODE_ENV === 'development',
})
