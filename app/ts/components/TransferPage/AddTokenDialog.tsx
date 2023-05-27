import { Signal } from '@preact/signals'
import { QueryToken } from '../QueryToken.js'

type Props = {
	show: Signal<'select' | 'add' | undefined>
}

export const AddTokenDialog = ({ show }: Props) => {
	if (show.value !== 'add') return <></>

	const handleCancel = () => {
		show.value = undefined
	}

	return (
		<div class='fixed inset-0 overflow-y-scroll scrollbar-hidden flex items-center justify-center'>
			<div class='fixed inset-0 top-0 bg-black/80' />

			<div class='relative bg-neutral-800 w-full max-w-md'>
				<div class='grid justify-end'>
					<button class='h-10 w-10' onClick={handleCancel}>
						&times;
					</button>
				</div>
				<div class='px-6 py-6'>
					<div class='font-bold mb-2 text-2xl'>Add Token</div>
					<div class='mb-2'>Enter the token's contract address to retrieve details</div>
					<QueryToken onSave={() => show.value = 'select' } />
				</div>
			</div>
		</div>
	)
}
