type Props = {
	onClick: () => void
	title: string
	description: string
}

export const MenuItem = ({ title, description, onClick }: Props) => {
	return (
		<button class='leading-tight border-b border-black/20 py-2 text-left' onClick={onClick}>
			<div class='font-bold'>{title}</div>
			<div class='text-black/50'>{description}</div>
		</button>
	)
}
