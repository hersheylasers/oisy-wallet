const { vitePreprocess } = require('@sveltejs/vite-plugin-svelte');

module.exports = {
	preprocess: vitePreprocess(),
	compilerOptions: {
		dev: process.env.NODE_ENV !== 'production'
	}
};
