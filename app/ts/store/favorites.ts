import { effect, signal } from '@preact/signals'
import { useEffect } from 'preact/hooks'
import { JSONStringify } from '../library/utilities.js'
import { TokenMeta } from './tokens.js'

export type FavoriteModel = {
	label?: string
	source: string
	recipientAddress: string
	token?: TokenMeta
	amount: string
}

const FAVORITES_CACHE_ID = 'favorites'

const getCachedFavorites = () => {
	const cached = localStorage.getItem(FAVORITES_CACHE_ID)
	if (cached === null) return []
	try {
		const parsed = JSON.parse(cached) as unknown
		// exit already if not iterable
		if (!Array.isArray(parsed)) throw new Error('Favorites cache is malformed.')
		// check if each item in array is correct model
		if (!parsed.every(isFavorite)) throw new Error('Some cached favorite is malformed')
		return parsed
	} catch (error) {
		throw new Error('Cache is corrupted')
	}
}

export function isFavorite(data: unknown): data is FavoriteModel {
	return data !== null && typeof data === 'object' && 'label' in data && typeof data.label === 'string' && 'source' in data && typeof data.source === 'string' && 'recipientAddress' in data && typeof data.recipientAddress === 'string'
}

const favorites = signal<FavoriteModel[]>(getCachedFavorites())

effect(() => {
	const uniqueTxns = Array.from(new Set(favorites.value))
	localStorage.setItem(FAVORITES_CACHE_ID, JSONStringify(uniqueTxns))
})

export function useFavorites() {
	const syncCacheChange = (event: StorageEvent) => {
		const newValue = event.newValue !== null ? (JSON.parse(event.newValue) as FavoriteModel[]) : []
		favorites.value = newValue
	}

	const add = (data: Omit<FavoriteModel, 'index'>) => {
		const current = favorites.peek()
		favorites.value = [...current, data]
	}

	const remove = (index: number) => {
		favorites.value = [...favorites.peek().slice(0, index), ...favorites.peek().slice(index + 1)]
	}

	const swapIndex = (indexA: number, indexB: number) => {
		// ignore same indices swap
		if (indexA === indexB) return

		const orderedFavorites = [...favorites.peek()]

		const tempA = orderedFavorites[indexA]
		orderedFavorites[indexA] = orderedFavorites[indexB]
		orderedFavorites[indexB] = tempA

		favorites.value = orderedFavorites
	}

	useEffect(() => {
		window.addEventListener('storage', syncCacheChange)
		return () => window.removeEventListener('storage', syncCacheChange)
	}, [])

	return { favorites, add, remove, swapIndex }
}
