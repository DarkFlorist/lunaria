import { Signal } from '@preact/signals'

export const TokenSearchField = ({ query }: { query: Signal<string> }) => {
	return (
		<div class='border border-black/10 border-b-black/20 border-b-2 bg-white grid grid-cols-[1fr,auto]'>
			<input class='h-10 px-4 outline-none' value={query.value} onInput={event => (query.value = event.currentTarget.value)} />
			{query.value.length > 0 && (
				<button class='w-10 h-10 flex items-center justify-center text-black/20 focus:text-black focus:font-bold focus:text-lg hover:text-black hover:font-bold hover:text-lg outline-none transition-all' onClick={() => (query.value = '')}>
					&times;
				</button>
			)}
		</div>
	)
}
