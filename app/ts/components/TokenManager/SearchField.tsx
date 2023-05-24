import { Signal } from '@preact/signals'
import { useEffect, useRef } from 'preact/hooks'
import * as Icon from '../Icon/index.js'

type Props = {
	value: Signal<string>
}

export const SearchField = ({ value }: Props) => {
	const inputRef = useRef<HTMLInputElement>(null)

	const handleClear = () => {
		value.value = ''
		inputRef.current?.focus()
	}

	useEffect(() => {
		inputRef.current?.focus()
	}, [])

	return (
		<div class='flex items-center bg-black border border-white/50 group focus-within:border-white'>
			<input ref={inputRef} class='px-4 h-12 w-full bg-black outline-none placeholder:text-white/30' placeholder='Search Tokens' value={value.value} onInput={event => (value.value = event.currentTarget.value)} />
			{value.value !== '' && <ClearButton onClick={handleClear} />}
		</div>
	)
}

const ClearButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button class='px-4 flex items-center justify-center outline-none text-white/30 focus:text-white hover:text-white' onClick={onClick}>
			<Icon.Xmark />
		</button>
	)
}
