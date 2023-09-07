import { useSignal } from "@preact/signals"
import { AmountField } from "./AmountInputField.js"

export const Test = () => {
	const amount = useSignal<bigint | undefined>(undefined)

	const sendTransaction = (e: Event) => {
		e.preventDefault()
	}

	return (
		<div class='fixed inset-0 bg-black text-white p-6'>
			<form onSubmit={sendTransaction}>
				<AmountField id="send_input" signalValue={amount} onSetMaxValue={()=> {}} />
				<button class='px-3 py-2 border mt-2' type="submit">send</button>
			</form>
		</div>
	)
}


