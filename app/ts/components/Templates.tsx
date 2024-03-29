import { useComputed, useSignal } from '@preact/signals'
import { formatEther, formatUnits } from 'ethers'
import { useTokenManager } from '../context/TokenManager.js'
import { useTemplates } from '../context/TransferTemplates.js'
import { removeNonStringsAndTrim } from '../library/utilities.js'
import { TransferTemplate } from '../schema.js'
import * as Icon from './Icon/index.js'

export const Templates = () => {
	const manage = useSignal(false)
	const { cache: templatesCache } = useTemplates()
	const { cache: tokensCache } = useTokenManager()

	const templates = useComputed(() => templatesCache.value.data)
	const getCachedToken = (contractAddress: string) => tokensCache.value.data.find(token => token.address === contractAddress)

	if (templates.value.length < 1)
		return (
			<div class='pl-4 mb-4'>
				<div class='flex justify-between'>
					<div class='text-white/30 text-sm mb-2'>Saved Transfers</div>
				</div>
				<div class='border border-white/30 border-dashed px-4 py-3'>
					<p class='text-white/50 text-sm'>Tip: You can save completed transfers so you don't have to fill out the form everytime.</p>
				</div>
			</div>
		)

	return (
		<div class='pl-4 mb-4'>
			<div class='flex justify-between'>
				<div class='text-white/30 text-sm mb-2'>Saved Transfers</div>
				<button class='text-xs mb-2 uppercase' onClick={() => (manage.value = !manage.value)}>
					{manage.value ? 'done' : 'manage'}
				</button>
			</div>
			<div class='grid gap-2'>
				{templates.value.map((template, index) => {
					const token = template.contractAddress && getCachedToken(template.contractAddress)
					const amount = token ? formatUnits(template.quantity, token.decimals) : formatEther(template.quantity)

					return (
						<a class={removeNonStringsAndTrim('grid gap-2 items-center bg-white/10 px-4 py-3', manage.value ? 'grid-cols-[min-content,minmax(0,1fr),min-content]' : 'grid-cols-1 hover:bg-white/30')} href={`#saved/${index}`}>
							<MoveUpButton show={manage.value === true} template={template} index={index} />
							<div class='grid gap-2 grid-cols-[auto,minmax(0,1fr)] items-center'>
								{token ? <img class='w-8 h-8' src={`/img/${token.address.toLowerCase()}.svg`} /> : <img class='w-8 h-8' src={`/img/ethereum.svg`} />}
								<div class='text-left'>
									<div>{template.label}</div>
									<div class='overflow-hidden text-ellipsis whitespace-nowrap text-sm text-white/50'>
										{amount} {token ? token.symbol : 'ETH'} to {template.to}
									</div>
								</div>
							</div>
							<RemoveButton show={manage.value === true} index={index} />
						</a>
					)
				})}
			</div>
		</div>
	)
}

type PromoteButtonProps = {
	show: boolean
	template: TransferTemplate
	index: number
}

const MoveUpButton = (props: PromoteButtonProps) => {
	const { cache } = useTemplates()
	const templates = useComputed(() => cache.value.data)

	const swapIndex = (indexA: number, indexB: number) => {
		// ignore same indices swap
		if (indexA === indexB) return

		const orderedTemplates = [...templates.value]

		const tempA = orderedTemplates[indexA]
		orderedTemplates[indexA] = orderedTemplates[indexB]
		orderedTemplates[indexB] = tempA

		cache.value = { ...cache.peek(), data: orderedTemplates }
	}

	if (!props.show) return <></>
	if (props.index === 0) return <div></div>

	return (
		<button class='text-lg' onClick={() => swapIndex(props.index, props.index - 1)}>
			<Icon.ArrowUp />
		</button>
	)
}

type RemoveButtonProps = {
	show: boolean
	index: number
}

const RemoveButton = (props: RemoveButtonProps) => {
	const { cache } = useTemplates()

	const remove = (index: number) => {
		const newData = [...cache.value.data.slice(0, index), ...cache.value.data.slice(index + 1)]
		cache.value = { ...cache.peek(), data: newData }
	}

	if (!props.show) return <></>

	return (
		<button class='text-sm' onClick={() => remove(props.index)}>
			<Icon.Xmark />
		</button>
	)
}
