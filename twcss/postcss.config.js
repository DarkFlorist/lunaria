const prettierConfig = require('../prettier.config.cjs')

module.exports = {
	plugins: {
		tailwindcss: {},
		autoprefixer: {},
		prettifycss: prettierConfig,
	},
}
