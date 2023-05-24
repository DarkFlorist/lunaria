import { signal, useSignalEffect } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { STORAGE_KEY_RECENTS } from '../library/constants.js';

type RecentTransaction = {
	hash: string
	date: number
}

const getSessionStorageCache = () => {
	const valueFromStorage = sessionStorage.getItem(STORAGE_KEY_RECENTS);
	return valueFromStorage ? JSON.parse(valueFromStorage) as RecentTransaction[] : [];
}

const recentTxns = signal(getSessionStorageCache());

export const useRecentTransfers = () => {
	const syncCacheChange = (event: StorageEvent) => {
		const newValue =	event.newValue !== null ? JSON.parse(event.newValue) as RecentTransaction[] : []
		recentTxns.value = newValue
	}

	const add = (txn: RecentTransaction) => {
		recentTxns.value = [...recentTxns.peek(), txn]
	}

	useSignalEffect(() => {
		const uniqueTxns = Array.from(new Set(recentTxns.value))
		sessionStorage.setItem(STORAGE_KEY_RECENTS, JSON.stringify(uniqueTxns))
	})

	useEffect(() => {
		window.addEventListener('storage', syncCacheChange)
		return () => window.removeEventListener('storage', syncCacheChange)
	}, [])

	return { recentTxns, add }
}
