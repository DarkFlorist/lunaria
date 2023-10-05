import { Signal, useSignal, useSignalEffect } from '@preact/signals'
import * as funtypes from 'funtypes'
import { useEffect } from 'preact/hooks'
import { safeSerialize } from '../schema.js'

export function persistSignalEffect<T extends funtypes.ParsedValue<funtypes.String, R>['config'], R>(cacheKey: string, derivedSignal: Signal<R>, funTypeParser: T, storage?: Storage) {
	const cacheStorage = storage ?? localStorage
	const error = useSignal<string | undefined>(undefined)

	const syncCacheToSignal = () => {
		const cache = cacheStorage.getItem(cacheKey)

		if (cache) {
			const parsed = funtypes.String.withParser(funTypeParser).safeParse(cache)
			derivedSignal.value = parsed.success ? parsed.value : derivedSignal.peek()
		}
	}

	const syncSignalToCache = () => {
		const serializedStore = safeSerialize(funtypes.String.withParser(funTypeParser), derivedSignal.value)
		if (!serializedStore.success) {
			error.value = serializedStore.message
			return
		}

		cacheStorage.setItem(cacheKey, serializedStore.value)
		error.value = undefined
	}

	useEffect(syncCacheToSignal, [cacheKey])
	useSignalEffect(syncSignalToCache)

	return { error }
}
