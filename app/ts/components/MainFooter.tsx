export const MainFooter = () => {
	return (
		<div class='p-4'>
			<div class='text-center'>
				<div class='text-white/50 font-bold my-4'>More tools from DarkFlorist</div>
				<div class='inline-grid md:grid-cols-2 gap-4'>
					<div>
						<a class='text-white hover:underline' href='https://dark.florist/'>
							The Interceptor
						</a>
						<div class='text-white/50 text-sm'>A browser extension that explains what kind of Ethereum transactions you are making</div>
					</div>
					<div>
						<a class='text-white hover:underline' href='https://bouquet.dark.florist/'>
							Bouquet
						</a>
						<div class='text-white/50 text-sm'>Turn your Interceptor simulations into MEV bundles.</div>
					</div>
				</div>
			</div>

			<div class='text-white/50 text-center'>
				<div class='mt-8'>
					Lunaria by{' '}
					<a class='text-white hover:underline' href='https://dark.florist'>
						Dark Florist
					</a>
				</div>
				<div class='inline-grid gap-4 grid-cols-3 mb-8'>
					<a class='text-white hover:underline' href='https://discord.gg/BeFnJA5Kjb'>
						Discord
					</a>
					<a class='text-white hover:underline' href='https://twitter.com/DarkFlorist'>
						Twitter
					</a>
					<a class='text-white hover:underline' href='https://github.com/DarkFlorist'>
						Github
					</a>
				</div>
			</div>
		</div>
	)
}
