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
					<div class='leading-tight text-white/75 text-sm'>The recipient address provided is a known token address and may be unintentional. Tokens sent to this address may be unrecoverable.</div>
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
					<div class='leading-tight text-white/75 text-sm'>The recipient address provided the same as the source address and may be unintentional. Proceeding will incur transaction fees.</div>
				</div>
			</div>
		)
	}
	return <></>
}
