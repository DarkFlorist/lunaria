import { Signal, useSignalEffect } from '@preact/signals'
import * as funtypes from 'funtypes'
import { ParsedValueConfig } from 'funtypes/lib/types/ParsedValue'
import { useEffect } from 'preact/hooks'

export function persistSignalEffect<T extends ParsedValueConfig<funtypes.String, R>, R>(cacheKey: string, derivedSignal: Signal<R>, funTypeParser: T, storage?: Storage) {
	const cacheStorage = storage ?? localStorage

	const syncCacheToSignal = () => {
		const cache = cacheStorage.getItem(cacheKey)

		if (cache) {
			const parsed = funtypes.String.withParser(funTypeParser).safeParse(cache)
			derivedSignal.value = parsed.success ? parsed.value : derivedSignal.peek()
		}
	}

	const syncSignalToCache = () => {
		const serializedStore = funtypes.String.withParser(funTypeParser).safeSerialize(derivedSignal.value)
		if (!serializedStore.success) {
			console.log('Failed to sync signal to cache')
			return
		}

		const stringCache = funtypes.String.safeParse(serializedStore.value)
		if (!stringCache.success) {
			console.log('serializedStore is not a string')
			return
		}

		cacheStorage.setItem(cacheKey, stringCache.value)
	}

	useEffect(syncCacheToSignal, [cacheKey])
	useSignalEffect(syncSignalToCache)
}
