import { useSignal, useSignalEffect } from '@preact/signals'
import { ethers } from 'ethers'
import { useEthereumNetwork } from '../../context/EthereumProvider.js'
import { useTransfer } from '../../context/Transfer.js'
import { TokenIcon } from '../Icon/Tokens/index.js'
import * as Icon from '../Icon/index.js'

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
						{address && <CopyAddressButton key={address} address={address} />}
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
	const network = useEthereumNetwork()

	if (network.value === undefined) {
		return (
			<span class='text-4xl'>
				<div style={{ width: '1em', height: '1em' }} class='bg-white/50 animate-puls' />
			</span>
		)
	}

	const tokenAddress = address === undefined ? 'Ether' : address

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
	const network = useEthereumNetwork()

	if (network.value === undefined) {
		return (
			<div class='font-bold'>
				<div class='animate animate-pulse w-40 h-4 bg-white/50 max-w-full' />
			</div>
		)
	}

	return (
		<div class='font-bold'>
			{name} <span class='text-white/50'>{symbol}</span>
		</div>
	)
}

const AssetDescription = ({ text }: { text: string }) => {
	const network = useEthereumNetwork()

	if (network.value === undefined) {
		return <div class='animate animate-pulse w-72 h-3 bg-white/50 max-w-full' />
	}

	return <div class='text-sm text-white/50 leading-tight overflow-hidden text-ellipsis'>{text}</div>
}

const CopyAddressButton = ({ address }: { address: string }) => {
	const isCopied = useSignal(false)
	const network = useEthereumNetwork()

	const handleClick = async () => {
		await navigator.clipboard.writeText(address)
		isCopied.value = true
	}

	useSignalEffect(() => {
		if (isCopied.value !== true) return
		setTimeout(() => {
			isCopied.value = false
		}, 1000)
	})

	if (network.value === undefined) {
		return <div class='animate animate-pulse w-20 h-4 bg-white/50' />
	}

	if (isCopied.value) {
		return (
			<button type='button' class='text-xs text-white/30 bg-white/10 px-2 py-1 uppercase whitespace-nowrap flex items-center gap-1' onClick={handleClick} disabled>
				<span>Copied!</span>
				<Icon.Check />
			</button>
		)
	}

	return (
		<button type='button' class='text-xs bg-white/10 px-2 py-1 uppercase whitespace-nowrap' onClick={handleClick}>
			Copy <span class='hidden md:inline'>Address</span>
		</button>
	)
}
