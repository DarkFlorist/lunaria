import { ComponentChildren, ComponentType } from "preact"
import { useEffect, useRef } from "preact/hooks"
import { signal } from "@preact/signals"

type Panel = {
	target: Element
	isIntersecting: boolean
}

type Panels = {
	nav: Panel | null
	main: Panel | null
}

const panelsObserver = signal<IntersectionObserver | undefined>(undefined)
const panels = signal<Panels>({ nav: null, main: null })

export const Root = ({ children }: { children: ComponentChildren }) => {
	const rootRef = useRef<HTMLDivElement>(null)

	const onIntersect: IntersectionObserverCallback = (entries) => {
		entries.map(entry => panels.value = { ...panels.value, [entry.target.id]: entry })
	}

	useEffect(() => {
		const options = { root: rootRef.current, rootMargin: '0px', threshold: 0.9 }
		panelsObserver.value = new IntersectionObserver(onIntersect, options);
		return () => panelsObserver.value?.disconnect()
	}, [rootRef.current])

	return (
		<div ref={rootRef} class='grid grid-cols-[75vw,100vw] sm:grid-cols-[40vw,100vw] md:grid-cols-[35vw,100vw] lg:grid-cols-[2fr,5fr] h-full snap-mandatory snap-x overflow-y-hidden scrollbar-hidden'>
			{children}
		</div>
	)
}

export const Navigation = ({ children }: { children: ComponentChildren }) => {
	const elementRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const element = elementRef.current
		const observer = panelsObserver.value
		if (element === null || observer === undefined) return
		observer.observe(element)
		return () => observer.unobserve(element)
	}, [elementRef.current, panelsObserver.value])

	return (
		<div id='nav' ref={elementRef} class='overflow-x-hidden snap-start scrollbar-hidden'>
			{children}
		</div>
	)
}

export const Main = ({ children }: { children: ComponentChildren }) => {
	const elementRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (elementRef.current === null || panelsObserver.value === undefined) return
		panelsObserver.value.observe(elementRef.current)
	}, [elementRef.current, panelsObserver.value])

	return (
		<div id='main' ref={elementRef} class='overflow-x-hidden overflow-y-scroll snap-start scrollbar-hidden'>
			{children}
		</div>
	)
}

export const Header = ({ children }: { children: ComponentChildren }) => {
	return (
		<div class='sticky top-0 bg-black/50'>
			{children}
		</div>
	)
}

type HeaderNavProps = {
	text?: string,
	onClick: () => void
	show?: boolean
	iconLeft?: ComponentType
	iconRight?: ComponentType
}

export const HeaderNav = (props: HeaderNavProps) => {
	const LeftIcon = props.iconLeft || (() => null)
	const RightIcon = props.iconRight || (() => null)
	const NavText = props.text || (() => null)

	return (
		<button class={`h-12 flex items-center gap-2 transition-opacity duration-500 ${props.show ? `opacity-1` : `opacity-0 pointer-events-none`}`} onClick={props.onClick}><LeftIcon /><NavText /><RightIcon /></button>
	)
}

export function usePanels() {
	return panels.value
}


