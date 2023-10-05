import { batch, Signal, useComputed, useSignal, useSignalEffect } from '@preact/signals'
import { Contract } from 'ethers'
import { Result } from 'funtypes'
import { ComponentChildren } from 'preact'
import { useTokenManager } from '../context/TokenManager.js'
import { useTransfer } from '../context/Transfer.js'
import { useWallet } from '../context/Wallet.js'
import { ERC20ABI } from '../library/ERC20ABI.js'
import { useAsyncState, useSignalRef } from '../library/preact-utilities.js'
import { ERC20Token, EthereumAddress, serialize } from '../schema.js'
import { useNotice } from '../store/notice.js'
import * as Icon from './Icon/index.js'

export const TokenAdd = () => {
	const queryResult = useSignal<Result<EthereumAddress> | undefined>(undefined)

	return (
		<AddTokenDialog>
			<div class='lg:w-[32rem] mx-auto'>
				<div class='text-2xl font-semibold px-4 pt-5 leading-0'>Add a token</div>
				<div class='px-4 mb-3 text-white/50'>Enter the token's contract address to retrieve details</div>
				<form method='dialog'>
					<div class='px-4 grid gap-y-3'>
						<QueryAddressField result={queryResult} />
						<QueryResult result={queryResult} />
					</div>
				</form>
			</div>
		</AddTokenDialog>
	)
}

const AddTokenDialog = ({ children }: { children: ComponentChildren }) => {
	const { ref, signal: dialogRef } = useSignalRef<HTMLDialogElement | null>(null)
	const { stage } = useTokenManager()

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

	useSignalEffect(showOrHideDialog)
	useSignalEffect(setClickListenerForDialog)

	return (
		<dialog ref={ref} class='w-full text-white backdrop:bg-black/80 backdrop:backdrop-blur-[2px] max-w-full max-h-full md:max-w-fit md:max-h-[calc(100vh-3rem)] md:max-w-fit bg-transparent'>
			{children}
		</dialog>
	)
}

const QueryAddressField = ({ result }: { result: Signal<Result<EthereumAddress> | undefined> }) => {
	const query = useSignal('')
	const isPristine = useSignal<true | undefined>(true)
	const { ref, signal: inputRef } = useSignalRef<HTMLInputElement | null>(null)

	const parsedAddress = useComputed(() => EthereumAddress.safeParse(query.value))

	const normalizeAndUpdateValue = (newValue: string) => {
		batch(() => {
			isPristine.value = undefined
			query.value = newValue.trim()
		})
	}

	const clearValue = () => {
		if (inputRef.value) {
			inputRef.value.value = ''
			const inputEvent = new InputEvent('input')
			inputRef.value.dispatchEvent(inputEvent)
			inputRef.value.focus()
		}
	}

	const validationMessage = useComputed(() => {
		if (parsedAddress.value.success) return undefined
		return 'Invalid ERC20 contract address.'
	})

	const validateField = () => {
		if (inputRef.value === null) return
		if (validationMessage.value === undefined) {
			inputRef.value.setCustomValidity('')
			return
		}

		inputRef.value.setCustomValidity(validationMessage.value)
		inputRef.value.reportValidity()
	}

	useSignalEffect(() => {
		result.value = parsedAddress.value
	})
	useSignalEffect(validateField)

	return (
		<fieldset data-pristine={isPristine.value} class='px-4 py-3 relative grid gap-2 grid-cols-1 grid-flow-col-dense items-center border border-white/50 focus-within:border-white disabled:bg-white/10 disabled:border-white/30 modified:enabled:invalid:border-red-400 group'>
			<label class='absolute top-2 left-4 text-sm text-white/50 capitalize'>contract address</label>
			<input ref={ref} type='text' value={query.value} onInput={e => normalizeAndUpdateValue(e.currentTarget.value)} required placeholder='0x0123...' class='peer outline-none pt-4 bg-transparent text-ellipsis disabled:text-white/30 placeholder:text-white/20 group-modified:enabled:invalid:text-red-400' />
			<ClearButton onClick={clearValue} />
		</fieldset>
	)
}

const QueryResult = ({ result }: { result: Signal<Result<EthereumAddress> | undefined> }) => {
	const { notify } = useNotice()
	const { value: query, waitFor, reset } = useAsyncState<ERC20Token>()
	const { browserProvider, network } = useWallet()

	const getTokenMetadata = () => {
		if (!result.value?.success) {
			reset()
			return
		}

		if (!browserProvider) {
			notify({ message: 'No compatible web3 wallet detected.', title: 'Failed to connect' })
			return
		}

		if (network.value.state !== 'resolved') {
			notify({ message: 'Your wallet may not connected to the chain.', title: 'Network unavailable' })
			return
		}

		const tokenAddress = result.value.value
		const activeChainId = network.value.value.chainId

		waitFor(async () => {
			const contract = new Contract(tokenAddress, ERC20ABI, browserProvider)
			const name = await contract.name()
			const symbol = await contract.symbol()
			const decimals = await contract.decimals()
			const chainId = activeChainId
			return { chainId, name, symbol, decimals, address: tokenAddress }
		})
	}

	useSignalEffect(getTokenMetadata)

	switch (query.value.state) {
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
			const token = serialize(ERC20Token, query.value.value)
			const parsedToken = ERC20Token.parse(token)

			return (
				<div class='px-4 py-3 border border-dashed border-white/30 grid grid-cols-[1fr,min-content] gap-x-2 items-center'>
					<div>
						{token.name} <span class='text-white/50'>({token.symbol})</span>
					</div>
					<UseTokenButton token={parsedToken} />
				</div>
			)
	}
}

const UseTokenButton = ({ token }: { token: ERC20Token }) => {
	const { cache, stage } = useTokenManager()
	const { input } = useTransfer()

	const tokenExistsInCache = useComputed(() => cache.value.data.some(t => t.address === token.address))

	const saveNewToken = () => {
		cache.value = Object.assign({}, cache.peek(), { data: cache.peek().data.concat([token]) })
	}

	const useToken = () => {
		batch(() => {
			if (!tokenExistsInCache.value) saveNewToken()
			input.value = Object.assign({}, input.peek(), { token })
			stage.value = undefined
		})
	}

	return (
		<button type='button' class='outline-none border border-white/50 focus|hover:border-white focus|hover:bg-white/10 px-4 h-10 whitespace-nowrap grid grid-cols-[min-content,1fr] gap-x-1 items-center font-semibold' onClick={useToken}>
			<PlusIcon />
			<span>{!tokenExistsInCache.value ? 'Save and ' : ''}Use</span>
		</button>
	)
}

const ClearButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button type='button' onClick={onClick} class='outline-none w-8 h-8 flex items-center justify-center border border-white/50 text-white/50 peer-placeholder-shown:hidden peer-disabled:hidden focus:text-white focus:border-white hover:text-white hover:border-white text-xs'>
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
