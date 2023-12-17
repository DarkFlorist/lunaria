import { Signal, useSignal } from "@preact/signals"
import { ComponentChildren, createContext } from "preact"
import { useContext } from "preact/hooks"
import { TEMPLATES_CACHE_KEY } from "../library/constants.js"
import { persistSignalEffect } from "../library/persistent-signal.js"
import { createCacheParser, TemplatesCache, TemplatesCacheSchema, TransferTemplate } from "../schema.js"

export type TemplatesContext = {
	cache: Signal<TemplatesCache>
}

export const TemplatesContext = createContext<TemplatesContext | undefined>(undefined)
export const TemplatesProvider = ({ children }: { children: ComponentChildren }) => {
	const cache = useSignal<TemplatesCache>({ data: [], version: '1.0.0' })

	persistSignalEffect(TEMPLATES_CACHE_KEY, cache, createCacheParser(TemplatesCacheSchema))

	return (
		<TemplatesContext.Provider value={{ cache }}>
			{children}
		</TemplatesContext.Provider>
	)
}

export function useTemplates() {
	const context = useContext(TemplatesContext)
	if (!context) throw new Error('useTransferTemplates can only be used within children of TransferTemplatesProfider')

	const { cache } = context

	const save = (data: TransferTemplate) => {
		console.log(data)
	}

	return { cache, save }
}
