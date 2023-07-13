import { ApplicationError, useErrors } from '../../store/errors.js'
import { ErrorPrompt } from '../ErrorPropmpt.js'

export const ErrorPage = () => {
	const { add } = useErrors()

	return (
		<div class="fixed inset-0 bg-black text-white">
			<button onClick={() => add(new ApplicationError('hey'))}>show error</button>
			<ErrorPrompt />
		</div>
	)
}
