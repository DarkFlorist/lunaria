import { ethers } from 'ethers'
import { useEthereumNetwork } from '../../context/EthereumProvider.js'
import { useTransfer } from '../../context/Transfer.js'
import { AssetMetadata, getNativeCurrencyByChainId, NativeAsset, TokenAsset } from '../../library/constants.js'
import { assertUnreachable } from '../../library/utilities.js'
import { Network } from '../../types.js'
import { TokenIcon } from '../Icon/Tokens/index.js'

type ActiveAssetDetailProps = {
	onChange: () => void
}

export const ActiveAssetDetail = ({ onChange }: ActiveAssetDetailProps) => {
	const transfer = useTransfer()
	const network = useEthereumNetwork()

	const getNativeCurrency = (network: Network) => {
		const chainIdHex = ethers.utils.hexlify(network.chainId)
		return getNativeCurrencyByChainId(chainIdHex)
	}

	if (network.value === undefined) {
		return (
			<div class='bg-gradient-to-r from-white/10 to-white/5 border-t border-b border-white/20'>
				<div class='grid [grid-template-areas:_"icon_title_action"_"icon_address_action"_"icon_description_action"] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 px-4 py-2'>
					<div style={{ gridArea: 'icon' }}>
						<span class='text-4xl'>
							<div style={{ width: '1em', height: '1em' }} class='bg-white/50 animate-puls' />
						</span>
					</div>
					<div style={{ gridArea: 'title' }}>
						<div class='animate animate-pulse w-40 h-4 bg-white/50 max-w-full' />
					</div>
					<div class='text-sm text-white/50 leading-tight' style={{ gridArea: 'description' }} title='Token Contract with 18 decimals'>
						<div class='animate animate-pulse w-72 h-3 bg-white/50 max-w-full' />
					</div>
					<div style={{ gridArea: 'action' }}>
						<div class='animate animate-pulse w-20 h-4 bg-white/50' />
					</div>
				</div>
			</div>
		)
	}

	const nativeCurrencyMetadata = getNativeCurrency(network.value)

	const formData = transfer.value.formData
	const assetMetadata = formData.value.token || nativeCurrencyMetadata

	return <AssetDetail metadata={assetMetadata} onChange={onChange} />
}

type AssetDetailProps = {
	metadata: AssetMetadata
	onChange: () => void
}

const AssetDetail = ({ metadata, onChange }: AssetDetailProps) => {
	switch (metadata.type) {
		case 'native':
			return <NativeAssetDetail metadata={metadata} onChange={onChange} />
		case 'token':
			return <TokenAssetDetail metadata={metadata} onChange={onChange} />
		default:
			assertUnreachable(metadata)
	}
}

type NativeAssetDetailProps = {
	metadata: NativeAsset
	onChange: () => void
}

const NativeAssetDetail = ({ metadata, onChange }: NativeAssetDetailProps) => {
	return (
		<div class='bg-gradient-to-r from-white/10 to-white/5 border-t border-b border-white/20'>
			<div class='grid [grid-template-areas:_"icon_title_action"_"icon_address_action"_"icon_description_action"] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 px-4 py-2'>
				<div style={{ gridArea: 'icon' }}>
					<span class='text-4xl'>
						<TokenIcon key='Ether' assetMetadata={metadata} />
					</span>
				</div>
				<div style={{ gridArea: 'title' }}>
					<div class='font-bold'>
						{metadata.name} <span class='text-white/50'>{metadata.symbol}</span>
					</div>
				</div>
				<div class='text-sm text-white/50 leading-tight' style={{ gridArea: 'description' }} title='Token Contract with 18 decimals'>
					<span>Ethereum native currency</span>
				</div>
				<div style={{ gridArea: 'action' }}>
					<div class='flex flex-col gap-1'>
						<button type='button' class='text-xs bg-white/10 px-2 py-1 uppercase md:hidden' onClick={onChange}>
							Change
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

type TokenAssetDetailProps = {
	metadata: TokenAsset
	onChange: () => void
}

const TokenAssetDetail = ({ metadata, onChange }: TokenAssetDetailProps) => {
	return (
		<div class='bg-gradient-to-r from-white/10 to-white/5 border-t border-b border-white/20'>
			<div class='grid [grid-template-areas:_"icon_title_action"_"icon_address_action"_"icon_description_action"] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 px-4 py-2'>
				<div style={{ gridArea: 'icon' }}>
					<span class='text-4xl'>
						<TokenIcon key={metadata.address} assetMetadata={metadata} />
					</span>
				</div>
				<div style={{ gridArea: 'title' }}>
					<div class='font-bold'>
						{metadata.name} <span class='text-white/50'>{metadata.symbol}</span>
					</div>
				</div>
				<div class='text-sm leading-tight' style={{ gridArea: 'address' }}>
					<span>{metadata.address}</span>
				</div>
				<div class='text-sm text-white/50 leading-tight' style={{ gridArea: 'description' }}>
					<span>Token Contract with {metadata.decimals} decimals</span>
				</div>
				<div style={{ gridArea: 'action' }}>
					<div class='flex flex-col gap-1'>
						<button type='button' class='text-xs bg-white/10 px-2 py-1 uppercase whitespace-nowrap'>
							Copy <span class='hidden md:inline'>Address</span>
						</button>
						<button type='button' class='text-xs bg-white/10 px-2 py-1 uppercase md:hidden' onClick={onChange}>
							Change
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
