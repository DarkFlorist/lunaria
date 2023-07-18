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
		<dialog ref={dialogRef} class='appearance-none bg-white/10 text-white backdrop:bg-red-black/80 px-6 py-4'>
			{latestError.value && (
				<>
					<div class='font-bold mb-2'>Application Error</div>
					<div class='text-sm mb-4 text-white/50'>
						<pre>{latestError.value.message}</pre>
					</div>
					<div class='flex justify-center'>
						<button class='border border-white/30 px-4 h-8 hover:border-white' onClick={dismissError}>
							Dismiss
						</button>
					</div>
				</>
			)}
		</dialog>
	)
}
