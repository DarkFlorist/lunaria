import { useSignal } from '@preact/signals'
import { ethers } from 'ethers'
import { JSX } from 'preact/jsx-runtime'
import { transferStore, transferStoreDefaults } from '../store/transfer.js'
import * as Layout from './Layout.js'

export const TransactionPage = () => {
	return (
		<Layout.Page>
			<Layout.Header />
			<Layout.Body>
				<Main />
			</Layout.Body>
			<Layout.Footer />
		</Layout.Page>
	)
}

const Main = () => {
	const hash = useSignal('')

	const handleSubmit = (event: JSX.TargetedEvent<HTMLFormElement>) => {
		event.preventDefault()
		transferStore.value = transferStoreDefaults
		window.location.href = `#tx/${hash.value}`
	}

	return (
		<div class='flex justify-center h-full w-full py-[10%] text-center'>
			<div class='w-full max-w-lg'>
				<div class='text-2xl md:text-3xl font-bold'>Inspect Transaction</div>
				<div class='text-white/50 text-sm mb-8'>View details of a submitted transaction, inspect fees, or event track progress status of your transfers.</div>
				<form onSubmit={handleSubmit}>
					<TransactionHashField onInput={(value) => hash.value = value} />
					<button class='px-6 py-2 border mt-4 hover:bg-white/10' type='submit'>Inspect</button>
				</form>
			</div>
		</div>
	)
}

export const TransactionHashField = ({ onInput }: { onInput: (value: string) => void }) => {

	function handleInput(e: JSX.TargetedEvent<HTMLInputElement>) {
		const field = e.currentTarget
		const validity = ethers.utils.hexDataLength(field.value) === 32 ? '' : 'Please enter a valid transaction hash'
		field.setCustomValidity(validity)
		field.reportValidity()
		onInput(field.value)
	}

	return (
		<div class='flex flex-col gap-1'>
			<input name='transaction_hash' autoComplete='off' type='text' onInput={handleInput} class='appearance-none relative flex px-3 h-10 bg-white/5 w-full outline-none disabled:bg-white/5 invalid:text-red-200 border-b border-white/30 focus:border-b-white text-center placeholder:text-white/30' placeholder='Enter transaction hash' required />
		</div>
	)
}
