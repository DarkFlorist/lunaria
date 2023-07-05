import { signal, useSignal, useSignalEffect } from '@preact/signals'
import { useEffect } from 'preact/hooks'
import { jsonParse, jsonStringify } from './utilities.js'

const sharedSignal = signal<Record<string, any>>({})

export function usePersistentSignal<T>(storageKey: string, initialValue: T, validateFn: (value: unknown) => value is T, storage: Storage | undefined = localStorage) {
	const storageValue = getCache(storageKey)
	const persistentSignal = useSignal<T>(storageValue || initialValue)
	const syncTimeStamp = useSignal(Date.now())

	function getCache(key: string) {
		const cacheString = storage.getItem(key)

		if (!cacheString) return initialValue

		try {
			const value = jsonParse(cacheString)
			if (!validateFn(value)) return initialValue
			return value
		} catch (error) {
			console.warn(`Storage cache with key ${storageKey} is malformed`)
			return initialValue
		}
	}

	function syncSignalToCache(key: string, obj: unknown): void {
		const jsonString = jsonStringify(obj)
		if (syncTimeStamp.value === Date.now()) return
		dispatchEvent(new StorageEvent('storage', { key, newValue: jsonString, storageArea: storage }))
		syncTimeStamp.value = Date.now()
	}

	function syncCacheToSignal(event: StorageEvent) {
		if (event.key !== storageKey) return
		const cacheValue = getCache(storageKey)
		persistentSignal.value = cacheValue
	}

	// sync changes persistentSignal → cache
	useSignalEffect(() => syncSignalToCache(storageKey, persistentSignal.value))

	// sync changes cache → signal
	useEffect(() => {
		window.addEventListener('storage', syncCacheToSignal)
		return () => window.removeEventListener('storage', syncCacheToSignal)
	}, [])

	return persistentSignal
}
