import { useSignalEffect } from '@preact/signals'
import { useSignalRef } from '../library/preact-utilities.js'

export const SubpathHostWarning = () => {
	const { ref, signal: dialogRef } = useSignalRef<HTMLDialogElement | null>(null)

	useSignalEffect(() => {
		if (!dialogRef.value) return

		// hosting on root is ok
		if (window.location.pathname === '/') return

		// if pathname is other than the root host, show warning
		dialogRef.value.showModal()
	})

	return (
		<dialog ref={ref} class='w-full text-white backdrop:bg-black/80 backdrop:backdrop-blur-[2px] max-w-full max-h-full md:max-w-lg md:max-h-[calc(100vh-3rem)] bg-transparent'>
			<form method='dialog' class='px-6'>
				<div class='text-lg font-bold text-center mb-4'>Warning! Insecure Host Detected.</div>
				<div class='text-center'>
					<p class='mb-4'>Hosting Lunaria from a subpath <pre class='inline px-2 py-[3px] bg-white/20 text-sm'>{window.location.pathname}</pre> is highly discouraged as this site uses browser storage. By doing so, your data may be accessed by other servers on the same domain.</p>
					<p class='mb-4'>If hosting this through IPFS, consider access using subdomain resolution instead which is the <a class='outline-none underline underline-offset-2' href='https://docs.ipfs.tech/how-to/gateway-best-practices/#avoiding-centralization'>recommended approach</a>.</p>
				</div>
				<div class='flex flex-col items-center'>
					<label class='flex gap-2 mb-4'>
						<input type='checkbox' required class='outline-none' />
						<span>I understand the risk and wish to continue</span>
					</label>
					<button type='submit' class='px-4 py-2 border border-white'>Continue</button>
				</div>
			</form>
		</dialog>
	)
}
