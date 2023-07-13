import { useErrors } from "../store/errors"

export const ErrorPrompt = () => {
	const { errors, remove } = useErrors()

	return (
		<>
			{errors.value.map(error => (
				<dialog class='bg-white/10 text-white' open={true}>
					<div>{error.message}</div>
					<button class='h-12 px-4 border border-white/50' onClick={() => remove(error.id)}>
						Dismiss
					</button>
				</dialog>
			))}
		</>
	)
}
