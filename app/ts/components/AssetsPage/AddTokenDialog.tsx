import { Signal } from '@preact/signals'
import { QueryToken } from '../QueryToken.js'

type Props = {
	show: Signal<boolean>
}

export const AddTokenDialog = ({ show }: Props) => {
	if (show.value !== true) return <></>

	const handleCancel = () => {
		show.value = false
	}

	return (
		<div class='fixed inset-0 flex items-center justify-center'>
			<div class='absolute inset-0 bg-black/50' />
			<div class='relative bg-white w-full max-w-md'>
				<div class='grid justify-end'>
					<button class='h-10 w-10' onClick={handleCancel}>
						&times;
					</button>
				</div>
				<div class='px-6 py-6'>
					<div class='font-bold mb-2'>Add Token</div>
					<div class='mb-2'>Enter the token's contract address to retrieve details</div>
					<QueryToken />
				</div>
			</div>
		</div>
	)
}
