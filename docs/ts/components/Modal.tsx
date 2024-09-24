import { ComponentChild } from 'preact'
import { useEffect } from 'preact/hooks'

interface ModalProps {
	title?: string
	hasCloseButton?: boolean
	onClickOutside?: () => void
	onClose: () => void
	children: ComponentChild
}

export const Modal = ({ onClose, children, hasCloseButton, title, onClickOutside }: ModalProps) => {
	useEffect(() => {
		// prevent page scroll when model is open
		document.body.style.overflow = 'hidden'
		return () => (document.body.style.overflow = 'auto')
	}, [])

	return (
		<div class='fixed inset-0 z-50 overflow-y-auto py-20'>
			<div class='fixed inset-0 bg-black/60 backdrop-blur-sm' onClick={onClickOutside}></div>
			<div class='relative bg-white/10 w-11/12 max-w-lg mx-auto z-50 shadow-lg text-white'>
				<div class='items-center justify-between border-b border-b-white/10 grid grid-cols-[1fr_auto]'>
					{title ? <div class='px-4 h-12 flex items-center'>{title}</div> : <></>}
					{hasCloseButton ? (
						<button class='h-12 w-12 text-2xl' onClick={onClose}>
							&times;
						</button>
					) : (
						<></>
					)}
				</div>
				<div class='p-4'>{children}</div>
			</div>
		</div>
	)
}

export default Modal
