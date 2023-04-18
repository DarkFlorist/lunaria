import { useSignal } from '@preact/signals'
import { AddTokenDialog } from './AddTokenDialog.js'
import { MenuItem } from './MenuItem.js'

export const TokenMenu = () => {
	const showAddTokenDialog = useSignal(false)

	return (
		<>
			<div class='text-black/50 text-xs uppercase mb-2'>Token Menu</div>
			<div class='grid gap-2'>
				<MenuItem title='Add Token' description='Add a token by providing an address' onClick={() => (showAddTokenDialog.value = true)} />
				<MenuItem title='Scan recent tokens' description='Check tokens you have interacted with on chain' onClick={() => {}} />
			</div>
			<AddTokenDialog show={showAddTokenDialog} />
		</>
	)
}
