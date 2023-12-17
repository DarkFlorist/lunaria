import { Signal, useComputed, useSignal } from '@preact/signals'
import { useTemplates } from '../context/TransferTemplates.js'
import { TransferTemplate } from '../schema.js'
import { useTransaction } from './TransactionProvider.js'

export const TemplateRecorder = () => {
	const { receipt } = useTransaction()
	const { save } = useTemplates()
	const isSaved = useSignal(false)
	const draft = useSignal<Partial<TransferTemplate>>({})

	const txReceipt = useComputed(() => receipt.value.state === 'resolved' ? receipt.value.value : null)
	if (txReceipt.value === null) return <></>

	const saveTemplate = () => {
		const newTemplate = TransferTemplate.safeParse(draft.value)
		if (!newTemplate.success) return
		save(newTemplate.value)
		isSaved.value = true
	}

	if (isSaved.value === true) return <AcknowledgeFavoriteAdd />

	return <AddTemplateForm formData={draft} onSubmit={saveTemplate} />
}

type AddTemplateFormProps = {
	onSubmit: () => void
	formData: Signal<Partial<TransferTemplate>>
}

const AddTemplateForm = ({ formData, onSubmit }: AddTemplateFormProps) => {
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
							<input class='border border-white/30 px-4 py-2 bg-transparent outline-none min-w-auto' type='text' value={formData.value.label} onInput={event => (formData.value = { ...formData.peek(), label: event.currentTarget.value })} placeholder='Add a label (optional)' />
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
