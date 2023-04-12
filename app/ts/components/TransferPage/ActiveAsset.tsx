import { ethers } from 'ethers'
import { useTransfer } from '../../context/Transfer.js'
import { TokenIcon } from '../Icon/Tokens/index.js'

type ActiveAssetDetailProps = {
	onChange: () => void
}

export const ActiveAssetDetail = ({ onChange }: ActiveAssetDetailProps) => {
	const transfer = useTransfer()

	const formData = transfer.value.formData
	const assetMetadata = formData.value.token

	return <AssetDetail address={assetMetadata?.address} name={assetMetadata?.name || 'Ether'} symbol={assetMetadata?.symbol || 'ETH'} onChange={onChange} />
}

type AssetDetailProps = {
	address?: string
	name: string
	symbol: string
	onChange: () => void
}

const AssetDetail = ({ address, name, symbol, onChange }: AssetDetailProps) => {
	return (
		<div class='bg-gradient-to-r from-white/10 to-white/5 border-t border-b border-white/20'>
			<div class='grid [grid-template-areas:_"icon_title_action"_"icon_description_action"] grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-[min-content] items-center gap-x-4 px-4 py-2'>
				<div style={{ gridArea: 'icon' }}>
					<DetailIcon address={address || undefined} />
				</div>
				<div style={{ gridArea: 'title' }}>
					<AssetTitle name={name} symbol={symbol} />
				</div>
				<div style={{ gridArea: 'description' }}>
					<AssetDescription text={address === undefined ? 'Native currency' : ethers.utils.getAddress(address)} />
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

const DetailIcon = ({ address }: { address?: string }) => {
	const tokenAddress = address === undefined ? 'Native' : address

	return (
		<span class='text-4xl'>
			<TokenIcon key={tokenAddress} address={tokenAddress} />
		</span>
	)
}

type AssetTitleProps = {
	name: string
	symbol: string
}

const AssetTitle = ({ name, symbol }: AssetTitleProps) => {
	return (
		<div class='font-bold'>
			{name} <span class='text-white/50'>{symbol}</span>
		</div>
	)
}

const AssetDescription = ({ text }: { text: string }) => {
	return <div class='text-sm text-white/50 leading-tight overflow-hidden text-ellipsis'>{text}</div>
}
