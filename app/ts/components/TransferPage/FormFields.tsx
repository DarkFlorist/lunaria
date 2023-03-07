import { ComponentChildren } from 'preact'
import { useAccountStore } from '../../context/Account.js'
import { useEthereumProvider } from '../../context/EthereumProvider.js'
import { useTransfer } from '../../context/Transfer.js'
import { assertUnreachable } from '../../library/utilities.js'
import { AddressField } from '../AddressField.js'
import { AmountField } from '../AmountField.js'

export const TransferAmountField = () => {
	const ethProvider = useEthereumProvider()
	const transfer = useTransfer()

	if (ethProvider.value.provider === undefined) {
		return <AmountField name='amount' value='' onChange={() => {}} label='Amount' />
	}

	switch (transfer.value.state) {
		case 'unsigned': {
			const formData = transfer.value.formData
			return <AmountField name='amount' value={formData.value.amount} onChange={amount => (formData.value = { ...formData.value, amount })} label='Amount' required />
		}
		case 'signing': {
			const formData = transfer.value.formData
			return <AmountField name='amount' value={formData.value.amount} onChange={() => {}} label='Amount' disabled />
		}
		case 'signed': {
			const formData = transfer.value.formData
			return <AmountField name='amount' value={formData.value.amount} onChange={() => {}} label='Amount' disabled />
		}
		case 'failed': {
			const formData = transfer.value.formData
			const resetForm = transfer.value.reset
			const handleChange = (amount: string) => {
				resetForm()
				formData.value = { ...formData.value, amount }
			}
			return <AmountField name='amount' value={formData.value.amount} onChange={handleChange} label='Amount' />
		}
	}
}

export const TransferAddressField = () => {
	const ethProvider = useEthereumProvider()
	const transfer = useTransfer()

	if (ethProvider.value.provider === undefined) {
		return <AddressField name='to' value='' onChange={() => {}} label='Recipient Address' />
	}

	switch (transfer.value.state) {
		case 'unsigned': {
			const formData = transfer.value.formData
			return <AddressField name='to' value={formData.value.to} onChange={to => (formData.value = { ...formData.value, to })} label='Recipient Address' required />
		}
		case 'signing': {
			const formData = transfer.value.formData
			return <AddressField name='to' value={formData.value.to} onChange={() => {}} label='Recipient Address' disabled />
		}
		case 'signed': {
			const formData = transfer.value.formData
			return <AddressField name='to' value={formData.value.to} onChange={() => {}} label='Recipient Address' disabled />
		}
		case 'failed': {
			const formData = transfer.value.formData
			const resetForm = transfer.value.reset
			const handleChange = (to: string) => {
				resetForm()
				formData.value = { ...formData.value, to }
			}
			return <AddressField name='to' value={formData.value.to} onChange={handleChange} label='Recipient Address' />
		}
	}
}

export const TransferForm = ({ children }: { children: ComponentChildren }) => {
	const accountStore = useAccountStore()
	const transfer = useTransfer()

	const handleSubmit = (event: Event) => {
		event.preventDefault()

		if (accountStore.value.state === 'disconnected') {
			accountStore.value.connect()
			return
		}

		switch (transfer.value.state) {
			case 'failed': {
				const formData = transfer.value.formData
				formData.value = { ...formData.value, to: '', amount: '' }
				transfer.value.reset()
				return
			}
			case 'signed':
				window.location.href = `#tx/${transfer.value.transactionResponse.hash}`
				return
			case 'signing':
				return
			case 'unsigned':
				transfer.value.send()
				return
		}
	}

	return <form onSubmit={handleSubmit}>{children}</form>
}

export const FormActions = () => {
	const account = useAccountStore()

	switch (account.value.state) {
		case 'disconnected':
			return <SubmitButton label='Connect Wallet' />
		case 'connecting':
			return <SubmitButton label='Connecting...' disabled />
		case 'failed':
			return <SubmitButton label='Unable to connect to wallet' disabled />
		case 'connected':
			return <SendButton />
		default:
			assertUnreachable(account.value)
	}
}

const SendButton = () => {
	const transfer = useTransfer()

	switch (transfer.value.state) {
		case 'unsigned':
			return <SubmitButton label='Send' />
		case 'signing':
			return <SubmitButton label='Sending...' disabled />
		case 'failed': {
			return <SubmitButton label='Clear Form?' />
		}
		case 'signed':
			return <SubmitButton label='View Transaction' />
	}
}

type SubmitButtonProps = {
	disabled?: boolean
	label: string
}

const SubmitButton = ({ disabled = false, label }: SubmitButtonProps) => {
	return (
		<button class='w-full px-4 py-2 border border-white bg-white/5 hover:bg-white/10 disabled:text-white/50 disabled:border-white/50' disabled={disabled}>
			{label}
		</button>
	)
}
