import { Signal, useComputed, useSignal, useSignalEffect } from '@preact/signals'
import { Contract } from 'ethers'
import { ComponentChildren, createContext } from 'preact'
import { useTokenManager } from '../context/TokenManager.js'
import { useTransfer } from '../context/Transfer.js'
import { useEthereumProvider } from '../context/Ethereum.js'
import { ERC20ABI } from '../library/ERC20ABI.js'
import { AsyncProperty, useAsyncState, useSignalRef } from '../library/preact-utilities.js'
import { ERC20Token, EthereumAddress, serialize } from '../schema.js'
import { useNotice } from '../store/notice.js'
import * as Icon from './Icon/index.js'
import { useContext, useRef } from 'preact/hooks'

export const TokenAdd = () => {
	return (
		<AddTokenDialog>
			<div class='lg:w-[32rem] mx-auto'>
				<div class='text-2xl font-semibold px-4 pt-5 leading-0'>Add a token</div>
				<div class='px-4 mb-3 text-white/50'>Enter the token's contract address to retrieve details</div>
				<form method='dialog'>
					<div class='px-4 grid gap-y-3'>
						<TokenQueryProvider>
							<QueryAddressField />
							<QueryStatus />
							<TokenDataToFields />
						</TokenQueryProvider>
					</div>
				</form>
			</div>
		</AddTokenDialog>
	)
}

type TokenQueryContext = {
	address: Signal<string>
	tokenQuery: Signal<AsyncProperty<ERC20Token>>
}

const TokenQueryContext = createContext<TokenQueryContext | undefined>(undefined)

const TokenQueryProvider = ({ children }: { children: ComponentChildren }) => {
	const { browserProvider, network } = useEthereumProvider()
	const { notify } = useNotice()
	const { value: tokenQuery, waitFor, reset } = useAsyncState<ERC20Token>()
	const address = useSignal('')

	const addressChecksum = useComputed(() => EthereumAddress.safeParse(address.value))

	const queryAddress = (tokenAddress: EthereumAddress) => {
		if (!browserProvider.value) {
			notify({ message: 'No compatible web3 wallet detected.', title: 'Failed to connect' })
			return
		}

		if (network.value.state !== 'resolved') {
			notify({ message: 'Your wallet may not connected to the chain.', title: 'Network unavailable' })
			return
		}

		const activeChainId = network.value.value.chainId
		const provider = browserProvider.value

		waitFor(async () => {
			const contract = new Contract(tokenAddress, ERC20ABI, provider)
			const namePromise = contract.name()
			const symbolPromise = contract.symbol()
			const decimalsPromise = contract.decimals()
			const name = await namePromise
			const symbol = await symbolPromise
			const decimals = await decimalsPromise
			const chainId = activeChainId
			return { chainId, name, symbol, decimals, address: tokenAddress }
		})
	}

	useSignalEffect(() => {
		if (!addressChecksum.value.success) {
			reset()
			return
		}
		queryAddress(addressChecksum.value.value)
	})

	return <TokenQueryContext.Provider value={ { address, tokenQuery } }>{ children }</TokenQueryContext.Provider>
}

const useTokenQuery = () => {
	const context = useContext(TokenQueryContext)
	if (context === undefined) throw new Error('useTokenQuery can only be used within children of TokenQueryProvider')
	return context
}


const AddTokenDialog = ({ children }: { children: ComponentChildren }) => {
	const { ref, signal: dialogRef } = useSignalRef<HTMLDialogElement | null>(null)
	const { cache, stage } = useTokenManager()
	const { input } = useTransfer()

	const closeDialogOnBackdropClick = (e: Event) => {
		const isClickWithinDialog = e.type === 'click' && e.target !== dialogRef?.value
		if (isClickWithinDialog) return
		dialogRef.value?.close()
	}

	const unsetStageIfClosedIntentionally = () => {
		stage.value = stage.value === 'add' ? undefined : stage.value
	}

	const showOrHideDialog = () => {
		const dialogElement = dialogRef.value
		const isDialogOpen = stage.value === 'add'
		if (!dialogElement) return
		dialogElement.onclose = unsetStageIfClosedIntentionally
		isDialogOpen ? dialogElement.showModal() : dialogElement.close()
	}

	const setClickListenerForDialog = () => {
		if (stage.value !== 'add') return
		document.addEventListener('click', closeDialogOnBackdropClick)
		return () => document.removeEventListener('click', closeDialogOnBackdropClick)
	}

	const handleDialogSubmit = (event: Event) => {
		if (!(event.target instanceof HTMLFormElement)) return
		const formData = new FormData(event.target)
		const parsedToken = ERC20Token.safeParse(Object.fromEntries(formData.entries()))
		if (parsedToken.success) {
			cache.value = Object.assign({}, cache.peek(), { data: cache.peek().data.concat([parsedToken.value]) })
			input.value = Object.assign({}, input.peek(), { token: parsedToken.value })
		}
	}

	useSignalEffect(showOrHideDialog)
	useSignalEffect(setClickListenerForDialog)

	return (
		<dialog ref={ ref } class='w-full text-white backdrop:bg-black/80 backdrop:backdrop-blur-[2px] max-w-full max-h-full md:max-h-[calc(100vh-3rem)] md:max-w-fit bg-transparent' onSubmit={ handleDialogSubmit }>
			{ children }
		</dialog>
	)
}

const QueryAddressField = () => {
	const inputRef = useRef<HTMLInputElement>(null)
	const { address } = useTokenQuery()

	const clearValue = () => {
		if (!inputRef.current) return
		inputRef.current.value = ''
	}

	const validateInputAndUpdateContext = (event: Event) => {
		if (!(event.target instanceof HTMLInputElement)) return
		const inputField = event.target

		address.value = inputField.value

		if (inputField.value === '') {
			inputField.setCustomValidity('')
			return
		}

		const parsedAddress = EthereumAddress.safeParse(inputField.value)
		if (!parsedAddress.success) {
			let errorMessage = 'Requires a valid ERC20 contract address'
			if (parsedAddress.message === 'Invalid address checksum.') { errorMessage = parsedAddress.message }
			event.target.setCustomValidity(errorMessage)
			event.target.reportValidity()
			return
		}

		event.target.setCustomValidity('')
	}

	return (
		<fieldset class='px-4 py-3 relative grid gap-2 grid-cols-1 grid-flow-col-dense items-center border border-white/50 focus-within:border-white disabled:bg-white/10 disabled:border-white/30 has-[:not(:placeholder-shown):invalid]:border-red-400'>
			<label class='absolute top-2 left-4 text-sm text-white/50 capitalize'>contract address</label>
			<input ref={ inputRef } type='text' onInput={ validateInputAndUpdateContext } required placeholder='0x0123...' class='peer outline-none pt-4 bg-transparent text-ellipsis disabled:text-white/30 placeholder:text-white/20 [&:not(:placeholder-shown)]:invalid:text-red-400' />
			<ClearButton onClick={ clearValue } />
		</fieldset>
	)
}

const QueryStatus = () => {
	const { tokenQuery } = useTokenQuery()

	switch (tokenQuery.value.state) {
		case 'inactive':
			return <></>
		case 'pending':
			return (
				<div class='px-4 py-3 grid grid-cols-[min-content,1fr] gap-x-2 items-center'>
					<Icon.Spinner />
					<span>Retrieving token information from the network...</span>
				</div>
			)
		case 'rejected':
			return (
				<div class='px-4 py-3 border border-dashed border-white/30 grid grid-cols-[min-content,1fr] gap-x-3 items-center'>
					<div class='text-3xl text-white/50'>
						<EmptyIcon />
					</div>
					<div>
						<div class='leading-tight'>No token contract matches the provided address</div>
						<div class='text-sm text-white/50'>Make sure the address and network is correctly set in your connected wallet.</div>
					</div>
				</div>
			)
		case 'resolved':
			// queried token will have included a checksum address
			const fetchedToken = tokenQuery.value.value

			return (
				<div class='px-4 py-3 border border-dashed border-white/30 grid grid-cols-1 gap-y-2'>
					<div class='text-white/50 text-sm'>Found a matching address</div>
					<div class='grid grid-cols-1 gap-y-1'>
						<div><span class='font-bold'>{ fetchedToken.name }</span> <span class='text-white/50'>({ fetchedToken.symbol })</span></div>
						<pre class='px-3 py-2 border border-white/10 font-mono bg-white/10 text-white/80 text-sm'>{ fetchedToken.address }</pre>
					</div>
				</div>
			)
	}
}

const TokenDataToFields = () => {
	const { cache } = useTokenManager()
	const { tokenQuery } = useTokenQuery()

	if (tokenQuery.value.state !== 'resolved') return <></>

	const token = serialize(ERC20Token, tokenQuery.value.value)
	const tokenExistsInCache = useComputed(() => cache.value.data.some(t => t.address === token.address))

	return (
		<>
			{ Object.entries(token).map(([key, value]) => <input type='hidden' name={ key } value={ value } />)}
			<button type='submit' class='px-4 py-3 border border-white/50 hover:bg-white/10 hover:border-white text-center outline-none flex gap-x-1 items-center justify-center'><PlusIcon />{ tokenExistsInCache.value ? '' : 'Save and ' }Use</button>
		</>
	)
}

const ClearButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button type='button' onClick={ onClick } class='outline-none w-8 h-8 flex items-center justify-center border border-white/50 text-white/50 peer-placeholder-shown:hidden peer-disabled:hidden focus:text-white focus:border-white hover:text-white hover:border-white text-xs'>
			<Icon.Xmark />
		</button>
	)
}

const PlusIcon = () => (
	<svg width='1em' height='1em' viewBox='0 0 24 24' data-name='Line Color' xmlns='http://www.w3.org/2000/svg'>
		<path d='M5 12h14m-7-7v14' style='fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2' />
	</svg>
)

const EmptyIcon = () => (
	<svg width='1em' height='1em' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
		<circle cx='12' cy='12' r='10' />
		<path d='m4.93 4.93 14.14 14.14' />
	</svg>
)
