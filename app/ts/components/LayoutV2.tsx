import { ComponentChildren } from "preact"
import { Ref, useEffect, useRef } from "preact/hooks"
import { signal } from "@preact/signals"

type Panel = {
	name: 'main' | 'nav' | 'aside'
	target: Element
	isActive: boolean
}

const panels = signal<Panel[]>([])

export const Page = ({ children }: { children: ComponentChildren }) => {
	const rootRef = useRef<HTMLDivElement>(null)

	return (
		<div ref={rootRef} class='grid grid-cols-[75vw,100vw,75vw] sm:grid-cols-[40vw,100vw,40vw] md:grid-cols-[30vw,70vw,30vw] lg:grid-cols-[2fr,5fr,2fr] h-full snap-mandatory snap-x overflow-y-hidden scrollbar-hidden'>
			{children}
		</div>
	)
}

export const Navigation = ({ children }: { children: ComponentChildren }) => {
	const elementRef = useRef<HTMLDivElement>(null)

	usePanelObserver('nav', elementRef)

	return (
		<div ref={elementRef} class='overflow-x-hidden snap-start scrollbar-hidden'>
			{children}
		</div>
	)
}

export const Main = ({ children }: { children: ComponentChildren }) => {
	const elementRef = useRef<HTMLDivElement>(null)

	usePanelObserver('main', elementRef)

	return (
		<div ref={elementRef} class='overflow-x-hidden snap-start scrollbar-hidden'>
			{children}
		</div>
	)
}

export const Aside = ({ children }: { children: ComponentChildren }) => {
	const elementRef = useRef<HTMLDivElement>(null)

	usePanelObserver('aside', elementRef)

	return (
		<div ref={elementRef} class='overflow-x-hidden snap-start scrollbar-hidden'>
			{children}
		</div>
	)
}

function usePanelObserver(name: Panel["name"], element: Ref<HTMLDivElement>) {
	const options = { rootMargin: '0px', threshold: 1.0 };
	const panel = { name, isActive: false } as const

	useEffect(() => {
		if (element.current === null) return;
		const observer = new IntersectionObserver((entries) => {
			const [entry] = entries;
			panels.value = [...panels.value.filter(p => p.name !== panel.name), { ...panel, target: entry.target, isActive: entry.isIntersecting }]
		}, options);

		observer.observe(element.current)

		return () => observer.disconnect()
	}, [element])
}


export function usePanels() {
	return {
		get nav() {
			return panels.value.find(p => p.name === 'nav')
		},
		get main() {
			return panels.value.find(p => p.name === 'main')
		},
		get aside() {
			return panels.value.find(p => p.name === 'aside')
		}
	}
}

