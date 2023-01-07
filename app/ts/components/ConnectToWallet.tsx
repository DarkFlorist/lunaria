import { FunctionalComponent } from 'preact'
import { EthereumJsonRpcError } from '../library/exceptions.js'
import { accountStore } from '../store/account.js'
import { Button } from './Button.js'
import * as Icon from './Icon/index.js'

export const ConnectToWallet = () => {
	const account = accountStore.value

	switch (account.status) {
		case 'disconnected':
			return (
				<Wrapper>
					<div class='leading-tight text-right'>Get started quickly by connecting your wallet</div>
					<div class='transition animate-bounce-x'>
						<Icon.ArrowRight />
					</div>
					<Button class='whitespace-nowrap' onClick={() => account.connect()}>
						Connect Wallet
					</Button>
				</Wrapper>
			)

		case 'busy':
			return (
				<Wrapper>
					<div class='flex flex-col items-end'>
						<div class='h-3 w-24 animate-pulse bg-white/50 rounded-sm my-1' />
						<div class='h-4 w-full min-w-[11rem] max-w-sm animate-pulse bg-white/50 rounded-sm my-1' />
					</div>
					<Button class='border border-white/30 py-2 px-4 rounded leading-tight text-white/50'>Connecting...</Button>
				</Wrapper>
			)

		case 'connected':
			return (
				<Wrapper>
					<div class='flex gap-4 min-w-0'>
						<div class='text-right min-w-0'>
							<div class='text-sm text-white/50'>Your Address</div>
							<div class='overflow-hidden text-ellipsis'>{account.address}</div>
						</div>
					</div>
				</Wrapper>
			)

		case 'rejected':
			if (account.error instanceof EthereumJsonRpcError) {
				return (
					<Wrapper>
						<div class='text-center md:text-right'>
							<div class='font-bold'>Failed to connect to wallet!</div>
							<div class='text-sm text-white/50'>
								<a class='flex items-center gap-1 italic' title={`${account.error.message} (${account.error.code})`}>
									<span>Open your wallet extension window for details</span>️ <Icon.Info />
								</a>
							</div>
						</div>
					</Wrapper>
				)
			}

			return (
				<Wrapper>
					<div class='text-center md:text-right'>
						<div class='font-bold'>Wallet was not detected!</div>
						<div class='text-sm text-white/50'>
							Have you installed one yet? <a>Read more</a>
						</div>
					</div>
				</Wrapper>
			)
	}
}

const Wrapper: FunctionalComponent = ({ children }) => {
	return (
		<div class='flex justify-center my-6 md:h-24 md:my-0'>
			<div class='flex gap-4 items-center justify-center py-4 px-6 border border-dashed border-white/30 rounded md:border-0 min-w-0 max-w-xl md:max-w-none lg:max-w-none md:py-0'>{children}</div>
		</div>
	)
}
