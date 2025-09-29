import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		global: 'globalThis',
	},
	optimizeDeps: {
		include: ['@metamask/detect-provider', '@metamask/eth-sig-util', 'buffer', 'crypto-browserify']
	},
	resolve: {
		alias: {
			buffer: 'buffer',
			crypto: 'crypto-browserify',
			stream: 'stream-browserify',
		}
	},
	ssr: {
		noExternal: []
	}
});