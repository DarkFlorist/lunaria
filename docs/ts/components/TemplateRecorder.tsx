import { Signal, useComputed, useSignal, useSignalEffect } from '@preact/signals'
import { toQuantity } from 'ethers'
import { JSX } from 'preact/jsx-runtime'
import { useTemplates } from '../context/TransferTemplates.js'
import { extractERC20TransferRequest } from '../library/ethereum.js'
import { serialize, TransferRequest, TransferTemplate } from '../schema.js'
import { useTransaction } from './TransactionProvider.js'

export const TemplateRecorder = () => {
	const { response, receipt } = useTransaction()
	const { add } = useTemplates()
	const isSaved = useSignal(false)
	const templateDraft = useSignal<TransferTemplate | undefined>(undefined)

	const erc20TransferTemplate = useComputed(() => {
		if (receipt.value.state !== 'resolved' || receipt.value.value === null) return
		const erc20TransferRequest = extractERC20TransferRequest(receipt.value.value)
		if (erc20TransferRequest === undefined) return
		const parsed = TransferRequest.safeParse(erc20TransferRequest)
		const label = templateDraft.peek()?.label
		return parsed.success ? { ...parsed.value, label } : undefined
	})

	const ethTransferTemplate = useComputed(() => {
		if (response.value.state !== 'resolved' || response.value.value === null) return
		const { to, from, value } = response.value.value
		const parsed = TransferRequest.safeParse({ to, from, quantity: toQuantity(value) })
		return parsed.success ? { label: templateDraft.peek()?.label, ...parsed.value } : undefined
	})

	useSignalEffect(() => {
		// Update draft with values coming from transaction
		templateDraft.value = erc20TransferTemplate.value || ethTransferTemplate.value
	})

	const saveTemplate = () => {
		if (!templateDraft.value) return
		const serialized = serialize(TransferTemplate, templateDraft.value)
		const template = TransferTemplate.parse(serialized)
		add(template)
		isSaved.value = true
	}

	// Activate form only after the transaction receipt is resolved
	if (receipt.value.state !== 'resolved') return <></>

	if (isSaved.value === true) return <TemplateAddConfirmation />

	return <AddTemplateForm formData={templateDraft} onSubmit={saveTemplate} />
}

type AddTemplateFormProps = {
	onSubmit: () => void
	formData: Signal<TransferTemplate | undefined>
}

const AddTemplateForm = ({ formData, onSubmit }: AddTemplateFormProps) => {
	const submitForm = (e: Event) => {
		e.preventDefault()
		onSubmit()
	}

	const updateLabel = (event: JSX.TargetedEvent<HTMLInputElement>) => {
		event.preventDefault()
		const templateData = formData.peek()
		if (!templateData) return
		formData.value = { ...templateData, label: event.currentTarget.value }
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
							<input class='border border-white/30 px-4 py-2 bg-transparent outline-none min-w-auto' type='text' value={formData.value?.label} onInput={updateLabel} placeholder='Add a label (optional)' />
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

const TemplateAddConfirmation = () => {
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
