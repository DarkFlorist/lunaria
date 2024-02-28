import { JSX } from 'preact/jsx-runtime'

export default (props?: JSX.SVGAttributes<SVGSVGElement>) => (
	<svg width='1em' height='1em' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
		<circle cx='16' cy='16' r='16' fill='white' />
		<path d='M16.0404 3.51221L15.8732 4.08021V20.5608L16.0404 20.7276L23.6903 16.2057L16.0404 3.51221Z' fill='#343434' />
		<path d='M16.0404 3.51221L8.39024 16.2057L16.0404 20.7276V12.7284V3.51221Z' fill='#8C8C8C' />
		<path d='M16.0404 22.1761L15.9462 22.291V28.1617L16.0404 28.4368L23.695 17.6565L16.0404 22.1761Z' fill='#3C3C3B' />
		<path d='M16.0404 28.4368V22.1761L8.39024 17.6565L16.0404 28.4368Z' fill='#8C8C8C' />
		<path d='M16.0404 20.7275L23.6903 16.2055L16.0404 12.7283V20.7275Z' fill='#141414' />
		<path d='M8.39024 16.2055L16.0404 20.7275V12.7283L8.39024 16.2055Z' fill='#393939' />
	</svg>
)
