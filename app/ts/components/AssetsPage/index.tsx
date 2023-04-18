import { useEffect } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import { TokenList } from './TokenList.js'
import { TokenSearchField } from './TokenSearchField.js'
import { useAccount } from '../../store/account.js'

export const AssetsPage = () => {
	const query = useSignal('')
	const { connect } = useAccount()

	useEffect(() => {
		// if (address.value.state === 'resolved') return
		connect(true)
	}, [])

	return (
		<div class='fixed inset-0 overflow-y-scroll bg-black/5'>
			<div class='px-4 grid gap-2 pt-10'>
				<div class='text-3xl font-bold flex items-end leading-none'>Tokens</div>
				<TokenSearchField query={query} />
				<TokenList query={query} />
			</div>
		</div>
	)
}
