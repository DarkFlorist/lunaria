import { useEffect } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import { TokenList } from './TokenList.js'
import { TokenSearchField } from './TokenSearchField.js'
import { useAccount } from '../../store/account.js'
import { TokenMenu } from './TokenMenu.js'

export const AssetsPage = () => {
	const query = useSignal('')
	const { connect } = useAccount()

	useEffect(() => {
		connect(true)
	}, [])

	return (
		<div class='fixed inset-0 overflow-y-scroll bg-black/5'>
			<div class='text-3xl font-bold flex items-end leading-none px-4 pt-10 pb-4'>Tokens</div>
			<div class='grid gap-4 px-4 md:grid-cols-[5fr,3fr] lg:grid-cols-[6fr,2fr]'>
				<div class='grid gap-2'>
					<TokenSearchField query={query} />
					<TokenList query={query} />
				</div>
				<div>
					<TokenMenu />
				</div>
			</div>
		</div>
	)
}
