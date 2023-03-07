import { ComponentChildren } from "preact"

export type AddTokenModalProps = {
	children: ComponentChildren
	onClose: () => void
}
export const AddTokenModal = (props: AddTokenModalProps) => {
	return (
		<div class='fixed inset-0 overflow-y-scroll scrollbar-hidden'>
			<div class='fixed inset-0 top-0 bg-black/80' onClick={() => props.onClose()} />
			<div class='relative mx-auto p-4 max-w-md'>test</div>
			test
		</div>
	)
}

