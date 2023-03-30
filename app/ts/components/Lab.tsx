import { useNotice } from '../store/notice.js'
import { Notices } from './Notice.js'

export const Lab = () => {
	const { notify } = useNotice()

	return (
		<div class='p-4'>
			<div class='text-2xl my-4'>Testing Page</div>
			<div>
				<div>Show test notification</div>
				<button class='bg-gray-300 px-3 py-2' onClick={() => notify({ title: 'Notice', message: 'Hello' })}>
					Test notice
				</button>
			</div>
			<Notices />
		</div>
	)
}
