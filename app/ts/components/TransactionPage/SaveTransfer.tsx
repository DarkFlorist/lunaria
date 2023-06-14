import { Signal, useSignal } from '@preact/signals'
import { useEffect } from 'preact/hooks'
import { FavoriteModel, isFavorite, useFavorities } from '../../store/favorites.js'

type Props = {
	show?: boolean
	addFavoriteStore: Signal<Partial<FavoriteModel> | undefined>
}

export const SaveTransfer = ({ show, addFavoriteStore }: Props) => {
	const isSaved = useSignal(false)
	const { add } = useFavorities()

	const saveTransfer = () => {
		if (addFavoriteStore.value === undefined || !isFavorite(addFavoriteStore.value)) return

		add(addFavoriteStore.value)
		isSaved.value = true
	}

	useEffect(() => {
		if (!show) return
		addFavoriteStore.value = { ...addFavoriteStore.peek(), label: '' }
	}, [show])

	if (!isFavorite(addFavoriteStore.value)) return <></>

	if (isSaved.value === true) return <AcknowledgeFavoriteAdd />

	return <AddFavoriteForm onSubmit={saveTransfer} addFavoriteStore={addFavoriteStore} />
}

type SaveFormProps = {
	onSubmit: () => void
	addFavoriteStore: Signal<Partial<FavoriteModel> | undefined>
}

const AddFavoriteForm = ({ addFavoriteStore, onSubmit }: SaveFormProps) => {
	if (addFavoriteStore.value === undefined) return <></>

	const submitForm = (e: Event) => {
		e.preventDefault()
		onSubmit()
	}

	return (
		<div class='my-4'>
			<div class='font-bold text-2xl mb-2'>Save Transfer</div>
			<div class='border border-dashed border-white/30 p-4'>
				<div class='flex flex-col md:flex-row-reverse items-center gap-4'>
					<div class='shrink w-full'>
						<p class='text-white/50 text-sm'>Prevent accidental inputs by saving this transfer so you can quickly do this again later. Add a label to this transfer and hit save to continue.</p>
					</div>
					<form class='w-full' onSubmit={submitForm}>
						<div class='grid gap-2 items-center w-full'>
							<input class='border border-white/30 px-4 py-2 bg-transparent outline-none min-w-auto' type='text' value={addFavoriteStore.value.label} onInput={event => (addFavoriteStore.value = { ...addFavoriteStore.peek(), label: event.currentTarget.value })} placeholder='Add a label' required />
							<button type='submit' class='border border-white/50 bg-white/10 px-4 py-3 outline-none focus:bg-white/20 hover:bg-white/20'>
								Save
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

const AcknowledgeFavoriteAdd = () => {
	return (
		<div class='my-4'>
			<div class='border border-dashed border-lime-400/40 bg-lime-400/5 p-4'>
				<div class='flex items-center justify-left gap-2'>
					<svg width='60' height='60' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
						<g fill='none' fillRule='evenodd'>
							<path d='M0 0h24v24H0z' />
							<circle stroke='currentColor' strokeWidth='2' strokeLinecap='round' cx='12' cy='12' r='9' />
							<path d='m8.5 12.5 1.651 2.064a.5.5 0 0 0 .744.041L15.5 10' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
						</g>
					</svg>
					<div>
						<div class='font-bold text-lg'>Transfer Saved!</div>
						<div class='text-white/50 leading-tight'>This transfer was added to the sidebar so you can use it as a starting point for your next transfer.</div>
					</div>
				</div>
			</div>
		</div>
	)
}
