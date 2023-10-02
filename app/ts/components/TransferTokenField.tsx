import { batch, Signal, useComputed, useSignal, useSignalEffect } from '@preact/signals'
import { useEffect, useRef } from 'preact/hooks'
import { stringIncludes, removeNonStringsAndTrim } from '../library/utilities.js'
import { useTransfer } from '../context/Transfer.js'
import * as Icon from './Icon/index.js'
import { ERC20Token } from '../schema.js'
import { useTokenManager } from '../context/TokenManager.js'
import { useWallet } from '../context/Wallet.js'

export const TransferTokenSelector = () => {
	return (
		<>
			<TokenSelectField />
			<TokenPicker />
		</>
	)
}

const TokenPicker = () => {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const { query, isSelecting } = useTokenManager()

	const closeManager = (e: Event) => {
		e.preventDefault()
		if (e.type === 'click' && e.target !== dialogRef?.current) return
		isSelecting.value = false
	}

	const toggleManager = () => {
		const dialogElement = dialogRef.current
		const isDialogOpen = isSelecting.value
		if (!dialogElement) return
		dialogElement.onclose = closeManager
		if (!isDialogOpen) return dialogElement.close()
		return dialogElement.showModal()
	}

	const closeManagerOnBackdropClick = () => {
		if (!isSelecting.value) return
		document.addEventListener('click', closeManager)
		return () => document.removeEventListener('click', closeManager)
	}

	useEffect(toggleManager, [isSelecting.value])
	useEffect(closeManagerOnBackdropClick, [isSelecting.value])

	return (
		<dialog ref={dialogRef} class='w-full text-white backdrop:bg-black/80 backdrop:backdrop-blur-[2px] max-w-full max-h-full md:max-w-fit md:max-h-[calc(100vh-3rem)] md:max-w-fit bg-transparent'>
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

const TokenSelectField = () => {
	const buttonRef = useRef<HTMLButtonElement>(null)
	const { isBusy } = useTransfer()
	const { isSelecting } = useTokenManager()
	const { input } = useTransfer()

	const activateOnKeypress = (e: KeyboardEvent) => {
		switch (e.key) {
			case '':
			case 'Enter':
			case 'ArrowUp':
			case 'ArrowDown':
				e.preventDefault()
				isSelecting.value = true
				break
			default:
				return
		}
	}

	const selectedAsset = useComputed(() => input.value.token)

	useEffect(() => {
		if (!buttonRef.current) return
		if (isSelecting.value === true) return
		if (document.activeElement === buttonRef.current) return
		buttonRef.current.focus()
	}, [isSelecting.value, buttonRef.current])

	return (
		<button type='button' ref={buttonRef} class={removeNonStringsAndTrim('border border-white/50 bg-transparent outline-none focus-within:border-white/80 focus-within:bg-white/5', isBusy.value && 'opacity-50')} onKeyDown={activateOnKeypress} onClick={() => (isSelecting.value = true)}>
			<div class='grid grid-cols-[1fr,auto] gap-4 items-center px-4 h-16'>
				<div class='grid text-left'>
					<div class='text-sm text-white/50 leading-tight'>Asset</div>
					<div class='appearance-none outline-none h-6 bg-transparent text-left'>{selectedAsset.value?.name || 'Ether'}</div>
				</div>
				<div class='grid grid-cols-[min-content,min-content] items-center gap-3'>
					<div class='text-white/50'>{selectedAsset.value?.symbol || 'ETH'}</div>
					<SwitchIcon />
				</div>
			</div>
		</button>
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
				<AssetCard token={token} />
			))}
			<AddTokenCard />
		</fieldset>
	)
}

const AssetCard = ({ token }: { token?: ERC20Token }) => {
	const radioRef = useRef<HTMLInputElement>(null)
	const { isSelecting } = useTokenManager()
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
			isSelecting.value = false
			return
		}
	}

	const selectAssetAndExitManager = () =>
		batch(() => {
			input.value = { ...input.peek(), token }
			isSelecting.value = false
		})

	return (
		<div class='relative aspect-[16/9] md:aspect-[4/5] md:min-w-[14em] bg-neutral-900 hover:bg-neutral-800'>
			<input id={uniqueId} ref={radioRef} type='radio' name={setId} checked={isSelected.value} autofocus={isSelected.value} tabIndex={1} onFocus={inputEventHandler} onKeyDown={inputEventHandler} class='peer absolute w-0 h-0 appearance-none' />
			<label for={uniqueId} class='grid grid-rows-[1fr,min-content] h-full p-4 border border-transparent peer-checked:border-white/50 peer-checked:peer-focus:border-white opacity-50 peer-checked:opacity-100 hover:opacity-100 cursor-pointer' onClick={selectAssetAndExitManager}>
				<div class='row-start-2 grid grid-cols-[min-content,1fr] gap-x-3 gap-y-2 items-center'>
					<object class='w-12 h-12 bg-white rounded-full overflow-hidden' data={iconPath} type='image/svg+xml' tabIndex={-1}>
						<div class='bg-white text-gray-900 font-bold text-lg w-full h-full flex items-center justify-center uppercase'>{token?.name.substring(0, 2)}</div>
					</object>
					<div class='text-white/50'>{token?.symbol || 'ETH'}</div>
					<div class='col-span-full'>{token?.name || 'Ether'}</div>
				</div>
			</label>
			{token ? <RemoveAssetDialog token={token} /> : <></>}
		</div>
	)
}

const RemoveAssetDialog = ({ token }: { token: ERC20Token }) => {
	const isRemoving = useSignal(false)

	const confirmRemove = () => {
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
	const { cache, isSelecting } = useTokenManager()

	const openAddTokenDialog = () => {
		const newToken: ERC20Token = {
			address: `0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984`,
			decimals: 18n,
			name: 'Uniswap',
			symbol: 'UNI',
			chainId: 5n,
		}

		cache.value = Object.assign({}, cache.peek(), { data: cache.peek().data.concat([newToken]) })

		isSelecting.value = false
	}

	return (
		<div class='relative aspect-[16/9] md:aspect-[4/5] md:min-w-[14em] bg-neutral-900'>
			<button for='transfer_asset_add' class='w-full h-full outline-none border border-transparent opacity-50 focus:opacity-100 hover:opacity-100 focus|hover:bg-neutral-800 cursor-pointer flex items-center justify-center' onClick={openAddTokenDialog} tabIndex={3}>
				<div>
					<div class='w-16 h-16 rounded-full bg-neutral-600 flex items-center justify-center mb-2'>
						<svg class='text-white/50' width='3em' height='3em' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
							<path fill-rule='evenodd' clip-rule='evenodd' d='M8 2.75a.5.5 0 0 0-1 0V7H2.75a.5.5 0 0 0 0 1H7v4.25a.5.5 0 0 0 1 0V8h4.25a.5.5 0 0 0 0-1H8V2.75Z' fill='currentColor'></path>
						</svg>
					</div>
					<div>Add Token</div>
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

const SwitchIcon = () => (
	<svg width='1em' height='1em' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
		<path d='M.75 0A.75.75 0 0 0 0 .75v2.5A.75.75 0 0 0 .75 4h2.5A.75.75 0 0 0 4 3.25V.75A.75.75 0 0 0 3.25 0H.75Zm7.226 4.624a.6.6 0 1 0 .848-.848L8.048 3H10.5a.3.3 0 0 1 .3.3v2.1a.6.6 0 1 0 1.2 0V3.3a1.5 1.5 0 0 0-1.5-1.5H8.048l.776-.776a.6.6 0 0 0-.848-.848l-1.8 1.8a.6.6 0 0 0 0 .848l1.8 1.8ZM4.024 7.376a.6.6 0 0 0-.848.848L3.952 9H1.5a.3.3 0 0 1-.3-.3V6.6a.6.6 0 1 0-1.2 0v2.1a1.5 1.5 0 0 0 1.5 1.5h2.452l-.776.776a.6.6 0 1 0 .848.848l1.8-1.8a.6.6 0 0 0 0-.848l-1.8-1.8Zm7.756 4.404a.75.75 0 0 0 .22-.53v-2.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 .75.75h2.5a.75.75 0 0 0 .53-.22Z' fill='currentColor' />
	</svg>
)

const TrashIcon = () => (
	<svg width='1em' height='1em' viewBox='0 0 56 56' xmlns='http://www.w3.org/2000/svg'>
		<path
			d='m44.523 48.66 1.618-34.265h2.343c.961 0 1.735-.797 1.735-1.758s-.774-1.782-1.735-1.782H38.242V7.34c0-3.352-2.273-5.531-5.883-5.531h-8.765c-3.61 0-5.86 2.18-5.86 5.53v3.516H7.54c-.937 0-1.758.82-1.758 1.782 0 .96.82 1.758 1.758 1.758h2.344L11.5 48.684c.164 3.375 2.39 5.507 5.766 5.507h21.492c3.351 0 5.601-2.156 5.765-5.53ZM21.484 7.574c0-1.336.985-2.273 2.391-2.273h8.227c1.43 0 2.414.937 2.414 2.273v3.281H21.484Zm-3.867 43.102c-1.36 0-2.367-1.032-2.437-2.39l-1.64-33.892h28.85l-1.546 33.891c-.07 1.383-1.055 2.39-2.438 2.39Zm17.344-4.125c.773 0 1.36-.633 1.383-1.524l.703-24.75c.023-.89-.586-1.547-1.383-1.547-.726 0-1.336.68-1.36 1.524l-.702 24.773c-.024.844.562 1.524 1.359 1.524Zm-13.898 0c.797 0 1.382-.68 1.359-1.524l-.703-24.773c-.024-.844-.656-1.524-1.383-1.524-.797 0-1.383.657-1.36 1.547l.727 24.75c.024.891.586 1.524 1.36 1.524Zm8.367-1.524V20.254c0-.844-.633-1.524-1.407-1.524-.773 0-1.43.68-1.43 1.524v24.773c0 .844.657 1.524 1.43 1.524.75 0 1.407-.68 1.407-1.524Z'
			fill='currentColor'
		/>
	</svg>
)
