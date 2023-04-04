import Modal from './Modal.js'
import { useNotice } from '../store/notice.js'

export const Notices = () => {
	const { notices } = useNotice()
	if (notices.value.length < 1) return <></>

	return (
		<Modal title={notices.value[0]?.title} onClose={() => (notices.value = notices.value.filter(n => n.id !== notices.value[0]?.id))} hasCloseButton>
			{notices.value[0]?.message}
		</Modal>
	)
}
