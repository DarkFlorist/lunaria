import { useTransfer } from '../context/Transfer.js'
import { useTokenManager } from '../context/TokenManager.js'
import { removeNonStringsAndTrim } from '../library/utilities.js'
import { useComputed, useSignalEffect } from '@preact/signals'
import { useSignalRef } from '../library/preact-utilities.js'

export const TransferTokenSelectField = () => {
	const { ref, signal: buttonRef } = useSignalRef<HTMLButtonElement | null>(null)
	const { isBusy } = useTransfer()
	const { stage } = useTokenManager()
	const { input } = useTransfer()

	const activateOnKeypress = (e: KeyboardEvent) => {
		switch (e.key) {
			case '':
			case 'Enter':
			case 'ArrowUp':
			case 'ArrowDown':
				e.preventDefault()
				stage.value = 'select'
				break
			default:
				return
		}
	}

	const selectedAsset = useComputed(() => input.value.token)

	const focusButtonOnClearStage = () => {
		if (!buttonRef.value) return
		if (document.activeElement === buttonRef.value) return
		if (stage.value === undefined) buttonRef.value.focus()
	}

	useSignalEffect(focusButtonOnClearStage)

	return (
		<button type='button' ref={ref} class={removeNonStringsAndTrim('border border-white/50 bg-transparent outline-none focus-within:border-white/80 focus-within:bg-white/5', isBusy.value && 'opacity-50')} onKeyDown={activateOnKeypress} onClick={() => (stage.value = 'select')}>
			<div class='grid grid-cols-[1fr,auto] gap-4 items-center px-4 h-16'>
				<div class='grid text-left'>
					<div class='text-sm text-white/50 leading-tight'>Asset</div>
					<div class='appearance-none outline-none h-6 bg-transparent text-left'>{selectedAsset.value?.name || 'Ether'}</div>
				</div>
				<div class='grid grid-cols-[min-content,min-content] items-center gap-3'>
					<div class='text-white/50'>{selectedAsset.value?.symbol || 'ETH'}</div>
					<SwitchIcon />
				</div>
			</div>
		</button>
	)
}

const SwitchIcon = () => (
	<svg width='1em' height='1em' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
		<path d='M.75 0A.75.75 0 0 0 0 .75v2.5A.75.75 0 0 0 .75 4h2.5A.75.75 0 0 0 4 3.25V.75A.75.75 0 0 0 3.25 0H.75Zm7.226 4.624a.6.6 0 1 0 .848-.848L8.048 3H10.5a.3.3 0 0 1 .3.3v2.1a.6.6 0 1 0 1.2 0V3.3a1.5 1.5 0 0 0-1.5-1.5H8.048l.776-.776a.6.6 0 0 0-.848-.848l-1.8 1.8a.6.6 0 0 0 0 .848l1.8 1.8ZM4.024 7.376a.6.6 0 0 0-.848.848L3.952 9H1.5a.3.3 0 0 1-.3-.3V6.6a.6.6 0 1 0-1.2 0v2.1a1.5 1.5 0 0 0 1.5 1.5h2.452l-.776.776a.6.6 0 1 0 .848.848l1.8-1.8a.6.6 0 0 0 0-.848l-1.8-1.8Zm7.756 4.404a.75.75 0 0 0 .22-.53v-2.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 .75.75h2.5a.75.75 0 0 0 .53-.22Z' fill='currentColor' />
	</svg>
)

const TrashIcon = () => (
	<svg width='1em' height='1em' viewBox='0 0 56 56' xmlns='http://www.w3.org/2000/svg'>
		<path
			d='m44.523 48.66 1.618-34.265h2.343c.961 0 1.735-.797 1.735-1.758s-.774-1.782-1.735-1.782H38.242V7.34c0-3.352-2.273-5.531-5.883-5.531h-8.765c-3.61 0-5.86 2.18-5.86 5.53v3.516H7.54c-.937 0-1.758.82-1.758 1.782 0 .96.82 1.758 1.758 1.758h2.344L11.5 48.684c.164 3.375 2.39 5.507 5.766 5.507h21.492c3.351 0 5.601-2.156 5.765-5.53ZM21.484 7.574c0-1.336.985-2.273 2.391-2.273h8.227c1.43 0 2.414.937 2.414 2.273v3.281H21.484Zm-3.867 43.102c-1.36 0-2.367-1.032-2.437-2.39l-1.64-33.892h28.85l-1.546 33.891c-.07 1.383-1.055 2.39-2.438 2.39Zm17.344-4.125c.773 0 1.36-.633 1.383-1.524l.703-24.75c.023-.89-.586-1.547-1.383-1.547-.726 0-1.336.68-1.36 1.524l-.702 24.773c-.024.844.562 1.524 1.359 1.524Zm-13.898 0c.797 0 1.382-.68 1.359-1.524l-.703-24.773c-.024-.844-.656-1.524-1.383-1.524-.797 0-1.383.657-1.36 1.547l.727 24.75c.024.891.586 1.524 1.36 1.524Zm8.367-1.524V20.254c0-.844-.633-1.524-1.407-1.524-.773 0-1.43.68-1.43 1.524v24.773c0 .844.657 1.524 1.43 1.524.75 0 1.407-.68 1.407-1.524Z'
			fill='currentColor'
		/>
	</svg>
)
