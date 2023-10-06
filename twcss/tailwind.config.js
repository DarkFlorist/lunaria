const plugin = require('tailwindcss/plugin')

module.exports = {
	content: ['../app/ts/**/*.(ts|tsx)'],
	theme: {},
	plugins: [
		plugin(function({ addVariant }) {
			addVariant('enabled', '&:not(:disabled)')
			addVariant('modified', '&:not([data-pristine])')
      addVariant('group-modified',':merge(.group):not([data-pristine]) &')
      addVariant('focus|hover', ['&:focus', '&:hover'])
		})
	],
	experimental: {
		optimizeUniversalDefaults: true,
	}
}
