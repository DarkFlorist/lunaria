import { useSignalEffect } from "@preact/signals"
import { Contract, TransactionResponse } from "ethers"
import { ComponentChildren } from "preact"
import { useTransfer } from "../context/Transfer.js"
import { ERC20ABI } from "../library/ERC20ABI.js"
import { useAsyncState } from "../library/preact-utilities.js"
import { TransferAddressField } from "./TransferAddressField.js"
import { TransferAmountField } from "./TransferAmountField.js"
import { TransferRecorder } from "./TransferRecorder.js"
import { TransferButton } from "./TransferButton.js"
import { TransferTokenSelector } from "./TransferTokenField.js"
import { useWallet } from "../context/Wallet.js"

export function SetupTransfer() {
	return (
		<TransferForm>
			<div class='grid gap-3'>
				<div class='grid gap-3 md:grid-cols-2'>
					<TransferTokenSelector />
					<TransferAmountField />
				</div>
				<TransferAddressField />
				<TransferButton />
				<TransferRecorder />
			</div>
		</TransferForm>
	)
}

const TransferForm = ({ children }: { children: ComponentChildren }) => {
	const { browserProvider } = useWallet()
	const { transaction, safeParse } = useTransfer()
	const { value: transactionQuery, waitFor } = useAsyncState<TransactionResponse>()

	const sendTransferRequest = (e: Event) => {
		e.preventDefault()

		if (!safeParse.value.success) return

		const transferInput = safeParse.value.value

		waitFor(async () => {
			const signer = await browserProvider.getSigner()

			// Ether transfer
			if (transferInput.token === undefined) {
				return await signer.sendTransaction({ to: transferInput.to, value: transferInput.amount })
			}

			// Token transfer
			const tokenMetadata = transferInput.token
			const contract = new Contract(tokenMetadata.address, ERC20ABI, signer)
			return await contract.transfer(transferInput.to, transferInput.amount)
		})
	}

	const listenForQueryChanges = () => {
		// do not reset shared state for other instances of this hooks
		if (transactionQuery.value.state === 'inactive') return
		transaction.value = transactionQuery.value
	}

	useSignalEffect(listenForQueryChanges)

	return (
		<form onSubmit={sendTransferRequest}>
			{children}
		</form>
	)
}
