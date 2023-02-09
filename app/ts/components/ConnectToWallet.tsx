import { ComponentChildren } from 'preact'
import { EthereumJsonRpcError } from '../library/exceptions.js'
import { useAccountStore } from './AccountContext.js'
import Blockie from './Blockie.js'
import { Button } from './Button.js'
import * as Icon from './Icon/index.js'

export const ConnectToWallet = () => {
	const accountStore = useAccountStore()

	switch (accountStore.value.state) {
		case 'connected':
			return (
				<Wrapper>
					<div class='grid md:grid-flow-col grid-cols-[minmax(min-content,max-content)_minmax(auto,max-content)] grid-rows-[minmax(min-content,max-content)] gap-x-4 items-center justify-center md:place-items-end'>
						<div class='row-span-2 md:order-last'>
							<Blockie scale={5} seed={accountStore.value.address} />
						</div>
						<div class='text-sm text-white/50'>Your Address</div>
						<div class='overflow-hidden text-ellipsis'>
							<span>{accountStore.value.address}</span>
						</div>
					</div>
				</Wrapper>
			)
		case 'disconnected': {
			return (
				<Wrapper>
					<div class='grid grid-cols-[minmax(auto,max-content)_minmax(auto,max-content)_minmax(auto,max-content)] gap-3 items-center justify-center'>
						<div class='leading-tight text-right'>Get started quickly by connecting your wallet</div>
						<div class='transition animate-bounce-x'>
							<Icon.ArrowRight />
						</div>
						<Button class='whitespace-nowrap' onClick={accountStore.value.connect.bind(undefined, false)}>
							Connect Wallet
						</Button>
					</div>
				</Wrapper>
			)
		}
		case 'connecting':
			return (
				<Wrapper>
					<div class='grid md:grid-flow-col grid-cols-[minmax(min-content,max-content)_minmax(min-content,max-content)] grid-rows-[minmax(min-content,max-content)] gap-x-4 items-center justify-center md:place-items-end'>
						<div class='h-10 w-10 animate-pulse bg-white/50 rounded row-span-2 md:order-last' />
						<div class='h-3 w-24 animate-pulse bg-white/50 rounded-sm my-1' />
						<div class='h-4 w-full min-w-[11rem] max-w-sm animate-pulse bg-white/50 rounded-sm my-1' />
					</div>
				</Wrapper>
			)
		case 'failed':
			if (accountStore.value.error instanceof EthereumJsonRpcError) {
				return (
					<Wrapper>
						<div class='text-center md:text-right'>
							<div class='font-bold'>Failed to connect to wallet!</div>
							<a class='text-sm text-white/50 flex items-center justify-center gap-1 italic' title={`${accountStore.value.error.message} (${accountStore.value.error.code})`}>
								<span>Open your wallet extension window for details</span>
								<Icon.Info />
							</a>
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

const Wrapper = ({ children }: { children: ComponentChildren }) => {
	return <div class='flex items-center justify-center md:justify-end border border-dashed border-white/30 md:border-0 rounded min-h-[4rem] md:min-h-0 px-3 md:px-0'>{children}</div>
}
