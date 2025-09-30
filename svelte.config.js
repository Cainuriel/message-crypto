import adapter from '@sveltejs/adapter-netlify';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// Configuración para Netlify
			edge: false,
			split: false
		})
	}
};

export default config;