const parse = require('postcss').parse
const format = require('prettier').format

const plugin = (opts = {}) => {
	return {
		postcssPlugin: 'prettifycss',
		async Root(root, { result }) {
			const cssString = root.toString()

			try {
				const formattedCss = await format(cssString, {
					parser: 'css',
					...opts,
				})
				result.root = parse(formattedCss)
			} catch (error) {
				console.error('Error formatting CSS:', error)
			}
		},
	}
}

plugin.postcss = true
module.exports = plugin
