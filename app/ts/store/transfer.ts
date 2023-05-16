import { useSignal, useSignalEffect } from "@preact/signals"
import { ethers } from "ethers"
import { ERC20ABI } from "../library/ERC20ABI"
import { AsyncProperty, useAsyncState } from "../library/preact-utilities"
import { ERC20, TransactionResponse } from "../types"
import { useProviders } from "./provider"
import { TokenMeta } from "./tokens"

type TransferInput = {
	recipientAddress: string,
	amount: string,
	token?: TokenMeta
}

export function createTransfer() {
	const providers = useProviders()
	const transfer = useSignal<AsyncProperty<TransactionResponse>>({ state: 'inactive' })
	const transferInput = useSignal<TransferInput>({ recipientAddress: '', amount: '', token: undefined })
	const { value: query, waitFor } = useAsyncState<TransactionResponse>()

	const send = () => {
		waitFor(async () => {
			const provider = providers.getbrowserProvider()
			if (provider === undefined) throw new Error('Web3Provider is not instantiated.')
			const signer = provider.getSigner()
			const to = ethers.utils.getAddress(transferInput.value.recipientAddress)

			// Ether transfer
			if (transferInput.value.token === undefined) {
				const value = ethers.utils.parseEther(transferInput.value.amount)
				return await signer.sendTransaction({ to, value })
			}

			// Token transfer
			const tokenMetadata = transferInput.value.token
			const contract = new ethers.Contract(tokenMetadata.address, ERC20ABI, signer) as ERC20
			const value = ethers.utils.parseUnits(transferInput.value.amount, tokenMetadata.decimals)
			return await contract.transfer(to, value)
		})
	}

	const listenForQueryChanges = () => {
		// do not reset shared state for other instances of this hooks
		if (query.value.state === 'inactive') return
		transfer.value = query.value
	}

	useSignalEffect(listenForQueryChanges)

	return { transfer, input: transferInput, send }
}
