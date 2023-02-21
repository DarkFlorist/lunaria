import { Signal, useSignal, useSignalEffect } from '@preact/signals'
import { ethers } from 'ethers'
import { useEthereumNetwork } from '../../context/EthereumProvider.js'
import { useTransfer } from '../../context/Transfer.js'
import { getNativeCurrencyByChainId, getTokenByChainId, NativeAsset, TokenAsset } from '../../library/constants.js'
import { assertUnreachable, removeNonStringsAndTrim } from '../../library/utilities.js'
import { TokenIcon } from '../Icon/Tokens/index.js'

type SelectAssetProps = {
	mobileVisibility: Signal<boolean>
}

export const SelectAsset = ({ mobileVisibility }: SelectAssetProps) => {
	const network = useEthereumNetwork()
	const tokens = useSignal<TokenAsset[] | undefined>(undefined)
	const native = useSignal<NativeAsset | undefined>(undefined)

	function listenForNetworkChanges() {
		if (network.value === undefined) return
		const chainIdHex = ethers.utils.hexlify(network.value.chainId)

		// update list on network change
		tokens.value = getTokenByChainId(chainIdHex)
		native.value = getNativeCurrencyByChainId(chainIdHex)
	}

	useSignalEffect(listenForNetworkChanges)

	// TODO: handle unknowns
	if (tokens.value === undefined || native.value === undefined) return null

	const backDropClassNames = removeNonStringsAndTrim('absolute inset-0 bg-black/70 transition-all md:bg-transparent', mobileVisibility.value === true ? 'duration-300 opacity-100 visible pointer-events-auto' : 'duration-400 opacity-0 invisible pointer-events-none')

	const modalClassNames = removeNonStringsAndTrim('relative max-h-[80%] overflow-scroll w-full bg-main px-4 py-4 rounded-t-3xl md:max-h-full pointer-events-auto md:bg-none md:p-0 md:rounded-none transition-all', mobileVisibility.value === true ? 'translate-y-0' : 'translate-y-full md:translate-y-0')

	return (
		<div class='fixed z-20 inset-0 flex items-end md:relative md:ml-4 pointer-events-none'>
			<div class={backDropClassNames} onClick={() => (mobileVisibility.value = false)} />
			<div class={modalClassNames}>
				<div class='text-white/50 text-xs capitalize md:text-sm'>select an asset</div>
				<div>
					<OptionNative key={native.value.symbol} metadata={native.value} />

					{tokens.value.map(token => (
						<OptionToken key={token.address} metadata={token} />
					))}
				</div>
			</div>
		</div>
	)
}

const OptionNative = ({ metadata }: { metadata: NativeAsset }) => {
	const transfer = useTransfer()

	switch (transfer.value.state) {
		case 'failed':
		case 'unsigned': {
			const formData = transfer.value.formData
			const isActive = formData.value.token === undefined

			const handleClick = () => (formData.value = { ...formData.value, token: undefined })

			const optionClassName = removeNonStringsAndTrim('border-b border-white/20 cursor-pointer', isActive && 'bg-gradient-to-l from-white/10 to-white/0')

			return (
				<div class={optionClassName} onClick={handleClick}>
					<div class='grid [grid-template-areas:_"icon_name"_"icon_balance"] grid-cols-[auto_1fr] items-center gap-x-4 px-4 py-2'>
						<div style={{ gridArea: 'icon' }}>
							<span class='text-2xl'>
								<TokenIcon assetMetadata={metadata} />
							</span>
						</div>
						<div class='leading-tight' style={{ gridArea: 'name' }}>
							{metadata.name}
						</div>
						<div class='leading-tight text-sm text-white/50' style={{ gridArea: 'balance' }}>
							<span class='md:hidden lg:inline'>balance:</span> 1014.130987460
						</div>
					</div>
				</div>
			)
		}
		case 'signing':
		case 'signed':
			return (
				<div class='border-b border-white/20 opacity-50 cursor-not-allowed'>
					<div class='grid [grid-template-areas:_"icon_name"_"icon_balance"] grid-cols-[auto_1fr] items-center gap-x-4 px-4 py-2'>
						<div style={{ gridArea: 'icon' }}>
							<span class='text-2xl'>
								<TokenIcon assetMetadata={metadata} />
							</span>
						</div>
						<div class='leading-tight' style={{ gridArea: 'name' }}>
							{metadata.name}
						</div>
						<div class='leading-tight text-sm text-white/50' style={{ gridArea: 'balance' }}>
							<span class='md:hidden lg:inline'>balance:</span> 1014.130987460
						</div>
					</div>
				</div>
			)
		default:
			assertUnreachable(transfer.value)
	}
}

const OptionToken = ({ metadata }: { metadata: TokenAsset }) => {
	const transfer = useTransfer()

	switch (transfer.value.state) {
		case 'failed':
		case 'unsigned': {
			const formData = transfer.value.formData
			const isActive = formData.value.token !== undefined && metadata.address === formData.value.token.address

			const handleClick = () => (formData.value = { ...formData.value, token: metadata })

			const optionClassName = removeNonStringsAndTrim('border-b border-white/20 cursor-pointer', isActive && 'bg-gradient-to-l from-white/10 to-white/0')

			return (
				<div class={optionClassName} onClick={handleClick}>
					<div class='grid [grid-template-areas:_"icon_name"_"icon_balance"] grid-cols-[auto_1fr] items-center gap-x-4 px-4 py-2'>
						<div style={{ gridArea: 'icon' }}>
							<span class='text-2xl'>
								<TokenIcon assetMetadata={metadata} />
							</span>
						</div>
						<div class='leading-tight' style={{ gridArea: 'name' }}>
							{metadata.name}
						</div>
						<div class='leading-tight text-sm text-white/50' style={{ gridArea: 'balance' }}>
							<span class='md:hidden lg:inline'>balance:</span> 1014.130987460
						</div>
					</div>
				</div>
			)
		}
		case 'signing':
		case 'signed':
			return (
				<div class='border-b border-white/20 opacity-50 cursor-not-allowed'>
					<div class='grid [grid-template-areas:_"icon_name"_"icon_balance"] grid-cols-[auto_1fr] items-center gap-x-4 px-4 py-2'>
						<div style={{ gridArea: 'icon' }}>
							<span class='text-2xl'>
								<TokenIcon assetMetadata={metadata} />
							</span>
						</div>
						<div class='leading-tight' style={{ gridArea: 'name' }}>
							{metadata.name}
						</div>
						<div class='leading-tight text-sm text-white/50' style={{ gridArea: 'balance' }}>
							<span class='md:hidden lg:inline'>balance:</span> 1014.130987460
						</div>
					</div>
				</div>
			)

		default:
			assertUnreachable(transfer.value)
	}
}
