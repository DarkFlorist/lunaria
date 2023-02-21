import { useTransfer } from '../../context/Transfer.js'
import { isEthereumJsonRpcError } from '../../library/exceptions.js'
import { assertUnreachable, removeNonStringsAndTrim } from '../../library/utilities.js'

export const SupportWidget = () => {
	return (
		<div>
			<div>Need support?</div>
			<p class='text-sm text-white/50'>Join our discord channel to get support from our active community members and stay up-to-date with the latest news, events, and announcements.</p>
		</div>
	)
}

export const ReviewWidget = () => {
	const transfer = useTransfer()

	switch (transfer.value.state) {
		case 'unsigned':
			return <Guide title='What happens when I click send?' content='This app will forward your request to the wallet you chose to connect with. The connected wallet handles signing and submitting your request to the chain.' />
		case 'signing':
			return <Guide title='Awaiting wallet confirmation...' content='At this point, your connected wallet will need action to proceed with this transaction. Carefully check the information before accepting the wallet confirmation.' />
		case 'failed': {
			let errorMessage = isEthereumJsonRpcError(transfer.value.error) ? transfer.value.error.error.message : transfer.value.error.message
			return <Guide title='Wallet returned an error!' content='Check that your inputs are correct and click Send again.' quote={errorMessage} isError={true} />
		}
		case 'signed':
			return <Guide title='Request Successfully Sent!' content="Your transaction is awaiting confirmation from the chain. You may click on the View Transaction button to check it's status." />
		default:
			assertUnreachable(transfer.value)
	}
}

type GuideProps = {
	title: string
	quote?: string
	content: string
	isError?: boolean
}

const Guide = ({ title, quote, content, isError }: GuideProps) => {
	const classNames = removeNonStringsAndTrim('h-full border p-4 text-center lg:text-left', isError ? 'border-red-400/30 bg-red-300/5' : 'border-white/30')

	return (
		<div class={classNames}>
			<div class='mb-3 font-bold'>{title}</div>
			{quote && <div class='leading-tight xl:border-l-4 xl:border-l-white/30 px-3 text-white/50 text-sm my-3 overflow-auto'>{quote}</div>}
			<div class='leading-tight text-sm text-white/50 mt-3'>{content}</div>
		</div>
	)
}
