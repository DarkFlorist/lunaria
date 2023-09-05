import { batch, Signal, useComputed, useSignal, useSignalEffect } from '@preact/signals'
import { Contract, formatUnits } from 'ethers'
import { useEffect, useRef } from 'preact/hooks'
import { useAccount } from '../context/Account.js'
import { useTokenManager } from '../context/TokenManager.js'
import { useTransfer } from '../context/Transfer.js'
import { useWallet } from '../context/Wallet.js'
import { ERC20ABI } from '../library/ERC20ABI.js'
import { useAsyncState, useSignalRef } from '../library/preact-utilities.js'
import { removeNonStringsAndTrim, stringIncludes } from '../library/utilities.js'
import { ERC20Token } from '../schema.js'
import { AsyncText } from './AsyncText.js'
import * as Icon from './Icon/index.js'

export const TokenPicker = () => {
	const { ref, signal: dialogRef } = useSignalRef<HTMLDialogElement | null>(null)
	const { query, stage } = useTokenManager()

	const closeDialogOnBackdropClick = (e: Event) => {
		const isClickWithinDialog = e.type === 'click' && e.target !== dialogRef?.value
		if (isClickWithinDialog) return
		dialogRef.value?.close()
	}

	const unsetStageIfClosedIntentionally = () => {
		stage.value = stage.value === 'select' ? undefined : stage.value
	}

	const showOrHideDialog = () => {
		const dialogElement = dialogRef.value
		const isDialogOpen = stage.value === 'select'
		if (!dialogElement) return
		dialogElement.onclose = unsetStageIfClosedIntentionally
		dialogElement[isDialogOpen ? 'showModal' : 'close']()
	}

	const setClickListenerForDialog = () => {
		if (stage.value !== 'select') return
		document.addEventListener('click', closeDialogOnBackdropClick)
		return () => document.removeEventListener('click', closeDialogOnBackdropClick)
	}

	useSignalEffect(showOrHideDialog)
	useSignalEffect(setClickListenerForDialog)

	return (
		<dialog ref={ref} class='w-full text-white backdrop:bg-black/80 backdrop:backdrop-blur-[2px] max-w-full max-h-full md:max-w-fit md:max-h-[calc(100vh-3rem)] md:max-w-fit bg-transparent'>
			<div class='text-2xl font-semibold px-4 pt-5 leading-0'>Select Asset</div>
			<form method='dialog'>
				<div class='sticky top-0 p-4 bg-black/50 z-10 backdrop-blur-[2px]'>
					<SearchField query={query} />
				</div>
				<AssetCardList />
			</form>
		</dialog>
	)
}

const AssetCardList = () => {
	const { cache } = useTokenManager()
	const { input } = useTransfer()
	const { query } = useTokenManager()
	const { network } = useWallet()

	const activeChainId = useComputed(() => (network.value.state === 'resolved' ? network.value.value.chainId : 1n))

	const matchTokensInChain = (token: ERC20Token) => token.chainId === activeChainId.value
	const matchQueriedTokens = (token: ERC20Token) => stringIncludes(token.name, query.value) || stringIncludes(token.symbol, query.value)

	const tokensList = useComputed(() => {
		const tokensInChain = cache.value.data.filter(matchTokensInChain)
		return tokensInChain.filter(matchQueriedTokens)
	})

	const gridStyles = useComputed(() => {
		let classNames = 'grid-cols-1'
		const length = tokensList.value.length + 2
		if (length > 1) classNames += ' sm:grid-cols-2'
		if (length > 2) classNames += ' md:grid-cols-3'
		if (length > 3) classNames += ' lg:grid-cols-4'
		if (length > 4) classNames += ' xl:grid-cols-5'
		return classNames
	})

	useSignalEffect(() => {
		input.value = { ...input.peek(), token: query.value !== '' ? tokensList.value.at(0) : undefined }
	})

	return (
		<fieldset class={removeNonStringsAndTrim('px-4 grid gap-4', gridStyles.value)} tabIndex={-1}>
			{query.value === '' || stringIncludes('ethers', query.value) ? <AssetCard /> : <></>}
			{tokensList.value.map(token => (
				<AssetCard key={token.address} token={token} />
			))}
			<AddTokenCard />
		</fieldset>
	)
}

const AssetCard = ({ token }: { token?: ERC20Token }) => {
	const radioRef = useRef<HTMLInputElement>(null)
	const { stage } = useTokenManager()
	const { input } = useTransfer()
	const iconPath = token ? `/img/${token.address.toLowerCase()}.svg` : `/img/ethereum.svg`

	const setId = 'transfer_asset'
	const uniqueId = token?.address || 'ether'

	const isSelected = useComputed(() => input.value.token?.address === token?.address)

	const inputEventHandler = (e: Event) => {
		if (e instanceof FocusEvent) {
			input.value = { ...input.peek(), token }
			return
		}

		if (e instanceof KeyboardEvent && e.key === 'Enter') {
			stage.value = undefined
			return
		}
	}

	const selectAssetAndExitManager = () =>
		batch(() => {
			input.value = { ...input.peek(), token }
			stage.value = undefined
		})

	return (
		<div class='relative aspect-[16/9] md:aspect-[4/5] md:min-w-[14em] bg-neutral-900 hover:bg-neutral-800'>
			<input id={uniqueId} ref={radioRef} type='radio' name={setId} checked={isSelected.value} autofocus={isSelected.value} tabIndex={1} onFocus={inputEventHandler} onKeyDown={inputEventHandler} class='peer absolute w-0 h-0 appearance-none' />
			<label for={uniqueId} class='grid grid-rows-[1fr,min-content] h-full p-4 border border-transparent peer-checked:border-white/50 peer-checked:peer-focus:border-white opacity-50 peer-checked:opacity-100 hover:opacity-100 cursor-pointer' onClick={selectAssetAndExitManager}>
				<div class='row-start-2 grid grid-cols-[min-content,1fr] gap-x-3 gap-y-1 items-center'>
					<object class='w-12 h-12 bg-white rounded-full overflow-hidden mb-1' data={iconPath} type='image/svg+xml' tabIndex={-1}>
						<div class='bg-white text-gray-900 font-bold text-lg w-full h-full flex items-center justify-center uppercase'>{token?.name.substring(0, 2)}</div>
					</object>
					<div class='text-whte/50'>{token?.symbol || 'ETH'}</div>
					<div class='col-span-full'>{token?.name || 'Ether'}</div>
					<div class='col-span-full text-white/50'>
						<TokenBalance token={token} />
					</div>
				</div>
			</label>
			{token ? <RemoveAssetDialog token={token} /> : <></>}
		</div>
	)
}

const TokenBalance = ({ token }: { token?: ERC20Token }) => {
	const { browserProvider} = useWallet()
	const { account } = useAccount()
	const { value: query, waitFor } = useAsyncState<bigint>()

	if (!browserProvider || !token) return <></>

	const getTokenBalance = async () => {
		if (account.value.state !== 'resolved') return
		const accountAddress = account.value.value
		const contract = new Contract(token.address, ERC20ABI, browserProvider)
		waitFor(async () => await contract.balanceOf(accountAddress))
	}

	useEffect(() => {
		getTokenBalance()
	}, [token])

	switch (query.value.state) {
		case 'inactive':
			return <></>
		case 'pending':
			return <AsyncText placeholderLength={10} />
		case 'rejected':
			return <div>error</div>
		case 'resolved':
			const displayValue = formatUnits(query.value.value, token.decimals)
			return <>{displayValue} {token.symbol}</>
	}

}

const RemoveAssetDialog = ({ token }: { token: ERC20Token }) => {
	const { cache } = useTokenManager()
	const isRemoving = useSignal(false)

	const confirmRemove = () => {
		cache.value = Object.assign({}, cache.peek(), { data: cache.peek().data.filter(t => t.address !== token.address) })
		isRemoving.value = false
	}

	const rejectRemove = () => {
		isRemoving.value = false
	}

	return (
		<div class='group absolute inset-0 p-3 peer-checked:hidden pointer-events-none'>
			<button type='button' class='peer group outline-none px-2 h-8 grid grid-flow-col gap-2 place-items-center absolute top-2 right-2 text-white/30 focus|hover:text-white pointer-events-auto' onClick={() => (isRemoving.value = true)}>
				<TrashIcon />
			</button>
			{isRemoving.value ? (
				<div class='absolute inset-0 bg-black border border-white text-center p-6 flex items-center justify-center pointer-events-auto'>
					<div class='w-full'>
						<div class='leading-tight text-white/50 text-sm'>This will remove the contract address for</div>
						<div class='font-semibold'>{token.name}</div>
						<div class='leading-tight text-white/50 text-sm mb-2'>Continue?</div>
						<div class='grid grid-cols-[min-content,min-content] gap-2 place-content-center'>
							<button onClick={rejectRemove} type='button' class='border border-white/50 hover:border-white px-3 h-8 text-sm font-semibold uppercase' tabIndex={-1}>
								no
							</button>
							<button onClick={confirmRemove} type='button' class='border border-white/50 hover:border-white px-3 h-8 text-sm font-semibold uppercase' tabIndex={-1}>
								yes
							</button>
						</div>
					</div>
				</div>
			) : (
				<></>
			)}
		</div>
	)
}

const AddTokenCard = () => {
	const { stage } = useTokenManager()
	const openAddTokenDialog = () => {
		stage.value = 'add'
	}

	return (
		<div class='relative aspect-[16/9] md:aspect-[4/5] md:min-w-[14em] bg-neutral-900'>
			<button for='transfer_asset_add' class='w-full h-full outline-none border border-transparent opacity-50 focus:opacity-100 hover:opacity-100 focus|hover:bg-neutral-800 cursor-pointer flex items-center justify-center' onClick={openAddTokenDialog} tabIndex={3}>
				<div class='grid place-items-center'>
					<div class='w-16 h-16 rounded-full bg-neutral-600 flex items-center justify-center mb-2'>
						<svg class='text-white/50' width='3em' height='3em' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
							<path fill-rule='evenodd' clip-rule='evenodd' d='M8 2.75a.5.5 0 0 0-1 0V7H2.75a.5.5 0 0 0 0 1H7v4.25a.5.5 0 0 0 1 0V8h4.25a.5.5 0 0 0 0-1H8V2.75Z' fill='currentColor'></path>
						</svg>
					</div>
					<div>New Token</div>
				</div>
			</button>
		</div>
	)
}

const SearchField = ({ query }: { query: Signal<string> }) => {
	const searchInputRef = useRef<HTMLInputElement>(null)

	const clearSearchQuery = () => {
		query.value = ''
		searchInputRef.current?.focus()
	}

	return (
		<div class='border border-white/50 focus-within:border-white bg-black grid grid-cols-[1fr,min-content] items-center gap-2 px-2 h-12'>
			<input ref={searchInputRef} placeholder='Search token' type='search' class='peer appearance-none clear-none outline-none bg-transparent w-full placeholder:text-white/30 focus:border-white min-w-0 px-1' value={query.value} onInput={e => (query.value = e.currentTarget.value)} tabIndex={2} />
			<button type='button' class='peer-placeholder-shown:hidden outline-none text-xs w-8 h-8 flex items-center justify-center border-white focus|hover:border' onClick={clearSearchQuery} tabIndex={-1}>
				<Icon.Xmark />
			</button>
		</div>
	)
}

const TrashIcon = () => (
	<svg width='1em' height='1em' viewBox='0 0 56 56' xmlns='http://www.w3.org/2000/svg'>
		<path
			d='m44.523 48.66 1.618-34.265h2.343c.961 0 1.735-.797 1.735-1.758s-.774-1.782-1.735-1.782H38.242V7.34c0-3.352-2.273-5.531-5.883-5.531h-8.765c-3.61 0-5.86 2.18-5.86 5.53v3.516H7.54c-.937 0-1.758.82-1.758 1.782 0 .96.82 1.758 1.758 1.758h2.344L11.5 48.684c.164 3.375 2.39 5.507 5.766 5.507h21.492c3.351 0 5.601-2.156 5.765-5.53ZM21.484 7.574c0-1.336.985-2.273 2.391-2.273h8.227c1.43 0 2.414.937 2.414 2.273v3.281H21.484Zm-3.867 43.102c-1.36 0-2.367-1.032-2.437-2.39l-1.64-33.892h28.85l-1.546 33.891c-.07 1.383-1.055 2.39-2.438 2.39Zm17.344-4.125c.773 0 1.36-.633 1.383-1.524l.703-24.75c.023-.89-.586-1.547-1.383-1.547-.726 0-1.336.68-1.36 1.524l-.702 24.773c-.024.844.562 1.524 1.359 1.524Zm-13.898 0c.797 0 1.382-.68 1.359-1.524l-.703-24.773c-.024-.844-.656-1.524-1.383-1.524-.797 0-1.383.657-1.36 1.547l.727 24.75c.024.891.586 1.524 1.36 1.524Zm8.367-1.524V20.254c0-.844-.633-1.524-1.407-1.524-.773 0-1.43.68-1.43 1.524v24.773c0 .844.657 1.524 1.43 1.524.75 0 1.407-.68 1.407-1.524Z'
			fill='currentColor'
		/>
	</svg>
)
