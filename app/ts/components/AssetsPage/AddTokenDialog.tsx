import { Signal } from '@preact/signals'

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
					<div>Add Token</div>
				</div>
			</div>
		</div>
	)
}
