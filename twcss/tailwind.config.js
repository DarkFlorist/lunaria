const plugin = require('tailwindcss/plugin')

module.exports = {
	content: ['../app/ts/**/*.(ts|tsx)'],
	theme: {},
	plugins: [
		plugin(function({ addVariant }) {
			addVariant('modified', '&:not([data-pristine])')
			addVariant('enabled', '&:not(:disabled)')
		})
	],
	experimental: {
		optimizeUniversalDefaults: true,
	}
}
