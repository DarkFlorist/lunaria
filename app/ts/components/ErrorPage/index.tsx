import { useErrors } from '../../store/errors.js'

export const ErrorPage = () => {
	const { add } = useErrors()

	const addErrors = () => {
		add('UNKNOWN')
		add('WALLET_MISSING', 'A web3 wallet is not detected')
	}

	return (
		<div class='fixed inset-0 bg-black text-white p-10'>
			<button class='px-4 h-8 border' onClick={addErrors}>
				simulate error
			</button>
		</div>
	)
}
