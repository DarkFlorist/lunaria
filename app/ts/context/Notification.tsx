import { ComponentChildren, createContext } from 'preact'
import { Signal, useSignal, useSignalEffect } from '@preact/signals'
import { useContext, useEffect } from 'preact/hooks'
import { useSignalRef } from '../library/preact-utilities.js'

type notification = {
	id: number
	message: string
	title: string
	duration?: number
}

type NotificationContext = {
	notifications: Signal<notification[]>
}

const NotificationContext = createContext<NotificationContext | undefined>(undefined)

export const NotificationProvider = ({ children }: { children: ComponentChildren }) => {
	const notifications = useSignal<notification[]>([])

	useSignalEffect(() => {
		if (!notifications.value.length) return
	})

	return (
		<NotificationContext.Provider value={{ notifications }}>
			{children}
			<NotificationCenter />
		</NotificationContext.Provider>
	)
}

export function useNotification() {
	const context = useContext(NotificationContext)
	if (!context) throw new Error('useNotification can only be used within children of NotificationProvider')

	const notify = (notification: Omit<notification, 'id'>) => {
		const newNotice = { id: Date.now(), ...notification }
		context.notifications.value = context.notifications.peek().concat([newNotice])
	}

	const shift = () => {
		context.notifications.value.shift()
	}

	return { ...context, notify, shift }
}

const NotificationCenter = () => {
	const { ref, signal: dialogRef } = useSignalRef<HTMLDialogElement | null>(null)
	const { notifications } = useNotification()

	useSignalEffect(() => {
		const dialogElement = dialogRef.value
		if (!dialogElement) return
		if (notifications.value.length) {
			dialogElement.show()
		} else {
			dialogElement.close()
		}
	})

	return (
		<dialog ref={ref} class='absolute bottom-4 bg-transparent'>
			<div class='grid gap-y-2'>
				{notifications.value.map(notification => (
					<Notification notification={notification} />
				))}
			</div>
		</dialog>
	)
}

const Notification = ({ notification }: { notification: notification }) => {
	const { notifications } = useNotification()
	const { id, title, message, duration } = notification

	const removeNotice = (id: number) => {
		notifications.value = notifications.peek().filter(n => n.id !== id)
	}

	useEffect(() => {
		setTimeout(() => removeNotice(id), duration || 3000)
	}, [])

	return (
		<div class='bg-neutral-900 text-white grid grid-cols-[1fr,min-content]'>
			<div class='px-4 py-3 '>
				<div class='font-semibold'>{title}</div>
				<div class='text-sm text-white/50'>{message}</div>
			</div>
			<button class='text-white/50 focus|hover:text-white w-10 h-10 flex items-center justify-center' onClick={() => removeNotice(id)}>&times;</button>
		</div>
	)
}
