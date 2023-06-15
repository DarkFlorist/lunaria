import { Signal, useComputed } from '@preact/signals'
import { useAccount } from '../../store/account.js'
import { useAccountTokens } from '../../store/tokens.js'
import { TransferData } from '../../store/transfer.js'
import * as Icon from '../Icon/index.js'

type Props = {
	data: Signal<TransferData>
}

export const TransferValidation = (props: Props) => {
	const { address } = useAccount()
	const { tokens } = useAccountTokens()

	const isRecipientAToken = useComputed(() => tokens.value.some(token => token.address.toLowerCase() === props.data.value.recipientAddress.toLowerCase()))

	const isRecipientOwn = useComputed(() => {
		if (address.value.state !== 'resolved') return false
		return address.value.value.toLowerCase() === props.data.value.recipientAddress.toLowerCase()
	})

	if (isRecipientAToken.value)
		return (
			<div class='grid grid-cols-[auto,1fr] items-center border border-orange-400/50 bg-orange-400/10 px-4 gap-4'>
				<Icon.Info class='text-4xl' />
				<div class='py-3'>
					<div>
						<strong>Warning:</strong> Recipient is a Token address
					</div>
					<div class='leading-tight text-white/75 text-sm mb-4'>The recipient address provided is a token contract address and may result in a loss of funds.</div>

					<label class='flex gap-2 items-center'>
						<input type='checkbox' required />
						<span>I understand that this might result in loss of funds. Proceed anyway.</span>
					</label>
				</div>
			</div>
		)

	if (isRecipientOwn.value) {
		return (
			<div class='grid grid-cols-[auto,1fr] items-center border border-orange-400/50 bg-orange-400/10 px-4 gap-4'>
				<Icon.Info class='text-4xl' />
				<div class='py-3'>
					<div>
						<strong>Warning:</strong> Recipient is the same as source
					</div>
					<div class='leading-tight text-white/75 text-sm mb-4'>This transactions sends funds to itself and results in loss of ether in form of transaction fees</div>
					<label class='flex gap-2 items-center'>
						<input type='checkbox' required />
						<span>I understand that this might result in loss of funds. Proceed anyway.</span>
					</label>
				</div>
			</div>
		)
	}
	return <></>
}
