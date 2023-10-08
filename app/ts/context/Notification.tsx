import { ComponentChildren, createContext } from "preact"
import { Signal, useSignal, useSignalEffect } from "@preact/signals"
import { useContext, useEffect } from "preact/hooks"
import { useSignalRef } from "../library/preact-utilities.js"

type notification = {
	id: number
	message: string
	title: string
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
		<dialog ref={ref} class='absolute bottom-4'>
			{notifications.value.map(notification => (
				<Notification notification={notification} />
			))}
		</dialog>
	)
}

const Notification = ({ notification }: { notification: notification }) => {
	const { notifications } = useNotification()

	const removeNotice = (id: number) => {
		notifications.value = notifications.peek().filter(n => n.id !== id)
	}

	useEffect(() => {
		setTimeout(() => removeNotice(notification.id), 3000)
	}, [])

	return (
		<div>{notification.message}</div>
	)
}
