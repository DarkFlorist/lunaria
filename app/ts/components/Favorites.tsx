import { useSignal } from '@preact/signals'
import { removeNonStringsAndTrim } from '../library/utilities.js'
import { FavoriteModel, useFavorites } from '../store/favorites.js'
import * as Icon from './Icon/index.js'

export const Favorites = () => {
	const manage = useSignal(false)
	const { favorites } = useFavorites()

	if (favorites.value.length < 1)
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
				{favorites.value.map((favorite, index) => {
					return (
						<a class={removeNonStringsAndTrim('grid gap-2 items-center bg-white/10 px-4 py-3', manage.value ? 'grid-cols-[min-content,minmax(0,1fr),min-content]' : 'grid-cols-1 hover:bg-white/30')} href={`#saved/${index}`}>
							<MoveUpButton show={manage.value === true} favorite={favorite} index={index} />
							<div class='grid gap-2 grid-cols-[auto,minmax(0,1fr)] items-center'>
								{favorite.token ? <img class='w-8 h-8' src={`./img/${favorite.token.address.toLowerCase()}.svg`} /> : <img class='w-8 h-8' src={`./img/ethereum.svg`} />}
								<div class='text-left'>
									<div>{favorite.label}</div>
									<div class='overflow-hidden text-ellipsis whitespace-nowrap text-sm text-white/50'>
										{favorite.amount} {favorite.token ? favorite.token.symbol : 'ETH'} to {favorite.recipientAddress}
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
	favorite: FavoriteModel
	index: number
}

const MoveUpButton = (props: PromoteButtonProps) => {
	const { swapIndex } = useFavorites()

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
	const { remove } = useFavorites()

	if (!props.show) return <></>

	return (
		<button class='text-sm' onClick={() => remove(props.index)}>
			<Icon.Xmark />
		</button>
	)
}
