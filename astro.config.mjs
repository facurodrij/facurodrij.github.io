// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://facurodrij.github.io',
	base: '',
	// Astro 7 defaults to JSX whitespace rules, which drop spaces between
	// inline elements split across lines. Keep the lossless Astro 6 behavior.
	compressHTML: true,
	vite: {
		plugins: [tailwindcss()],
	},
});
