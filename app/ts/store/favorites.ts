import { usePersistentSignal } from '../library/persistent-signal.js'
import { TokenMeta } from './tokens.js'

export type FavoriteModel = {
	label?: string
	source: string
	recipientAddress: string
	token?: TokenMeta
	amount: string
}

const FAVORITES_CACHE_ID = 'favorites'

export function useFavorites() {
	const favorites = usePersistentSignal(FAVORITES_CACHE_ID, [], isFavoritesArray)

	const add = (data: FavoriteModel) => {
		favorites.value = [...favorites.value, data]
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

	return { favorites, add, remove, swapIndex }
}

export function isFavorite(data: unknown): data is FavoriteModel {
	return data !== null && typeof data === 'object' && 'label' in data && typeof data.label === 'string' && 'source' in data && typeof data.source === 'string' && 'recipientAddress' in data && typeof data.recipientAddress === 'string'
}

export function isFavoritesArray(data: unknown): data is FavoriteModel[] {
	return Array.isArray(data) && data.every(isFavorite)
}
