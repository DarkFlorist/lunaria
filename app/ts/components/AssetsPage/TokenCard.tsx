import { ComponentChildren } from 'preact'
import { Signal, useSignal, useSignalEffect } from '@preact/signals'
import { TokenMeta, useAccountTokens } from '../../store/tokens.js'

type Props = {
	token: TokenMeta
}

export const TokenCard = ({ token }: Props) => {
	const confirmRemoval = useSignal(false)
	return (
		<>
			<Card>
				<div class='flex justify-end'>
					<button class='w-10 h-10 flex items-center justify-center' onClick={() => (confirmRemoval.value = true)}>
						&times;
					</button>
				</div>
				<div class='p-4'>
					<TokenIcon address={token.address} />
					<div>
						<span class='font-bold'>{token.name}</span> ({token.symbol})
					</div>
				</div>
			</Card>
			<RemoveDialog visibility={confirmRemoval} token={token} />
		</>
	)
}

const TokenIcon = ({ address }: { address: string }) => {
	return (
		<object class='w-12 h-12 bg-white rounded-full border-[3px] border-white shadow-[0px_0px_0px_1px] shadow-black/50 my-2' data={`/img/${address.toLocaleLowerCase()}.svg`} type='image/svg+xml'>
			<img class='w-full h-full' src={`/img/ethereum.svg`} />
		</object>
	)
}

type CardProps = {
	children: ComponentChildren
}

const Card = ({ children }: CardProps) => {
	return <div class='bg-white border border-black/10 border-b-black/20 border-b-2 grid grid-rows-[auto,1fr] h-48 items-end'>{children}</div>
}

type ConfirmationProps = {
	token: TokenMeta
	visibility: Signal<boolean>
}

const RemoveDialog = ({ visibility, token }: ConfirmationProps) => {
	const { removeToken } = useAccountTokens()

	const handleConfirm = () => {
		removeToken(token.address)
		visibility.value = false
	}

	const handleCancel = () => {
		visibility.value = false
	}

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key !== 'Escape') return
		visibility.value = false
	}

	useSignalEffect(() => {
		if (visibility.value === false) {
			window.removeEventListener('keydown', handleKeyPress)
			return
		}

		window.addEventListener('keydown', handleKeyPress)
	})

	if (visibility.value === false) return <></>

	return (
		<div class='fixed inset-0 flex justify-center items-center'>
			<div class='absolute inset-0 bg-black/50' onClick={handleCancel}></div>
			<div class='relative bg-white w-full max-w-sm mx-4'>
				<div class='min-h-[200px] grid grid-rows-[40px,minmax(100px,1fr)]'>
					<div class='grid grid-cols-[1fr,40px]'>
						<div class='px-4 grid items-center font-bold'></div>
						<button onClick={handleCancel}>&times;</button>
					</div>
					<div class='grid place-items-center'>
						<div class='w-4/5 text-center'>
							Are you sure you wnat to remove <span class='italic'>{token.name}</span> from you tokens list?
						</div>
						<button class='font-bold px-4 py-2' onClick={handleConfirm}>
							Yes, remove {token.name}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
