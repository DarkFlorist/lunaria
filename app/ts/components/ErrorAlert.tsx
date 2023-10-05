import { useSignalEffect } from '@preact/signals'
import { useSignalRef } from '../library/preact-utilities.js'
import { useErrors } from '../store/errors.js'

export const ErrorAlert = () => {
	const { ref: dialogRef, signal: dialogEl } = useSignalRef<HTMLDialogElement | null>(null)
	const { latest: latestError, remove } = useErrors()

	useSignalEffect(() => {
		if (!dialogEl.value) return
		if (!dialogEl.value.open && latestError.value) dialogEl.value.showModal()
		if (dialogEl.value.open && !latestError.value) dialogEl.value.close()
	})

	const dismissError = () => {
		if (!latestError.value) return
		remove(latestError.value.code)
	}

	return (
		<dialog ref={dialogRef} class='appearance-none bg-white/10 text-white backdrop:transparent mt-8 mb-auto ml-auto mr-8 px-6 pt-6 pb-4 relative'>
			{latestError.value && (
				<>
					<button class='absolute left-auto right-0 top-0 px-4 h-8 hover:border-white' onClick={dismissError}>
						&times;
					</button>
					<div class='font-bold mb-2'>Application Error</div>
					<div class='text-sm text-white/50'>
						<pre>{latestError.value.message}</pre>
					</div>
				</>
			)}
		</dialog>
	)
}
