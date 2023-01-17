import { ComponentChildren, JSX } from 'preact'
import { removeNonStringsAndTrim } from '../library/utilities.js'

type LayoutComponentProps = JSX.HTMLAttributes<HTMLDivElement> & { children: ComponentChildren }

export const Page = ({ children, class: classString }: LayoutComponentProps) => {
	const classNames = removeNonStringsAndTrim(`absolute inset-0 text-white overflow-y-scroll`, classString)
	return (
		<div class='fixed bg-main inset-0'>
			<div class='fixed inset-0 bg-polka'></div>
			<div class={classNames}>{children}</div>
		</div>
	)
}

export const Header = ({ children, class: classString }: LayoutComponentProps) => {
	const classNames = removeNonStringsAndTrim(`[grid-area:header]`, classString)
	return <div class={classNames}>{children}</div>
}

export const Body = ({ children, class: classString }: LayoutComponentProps) => {
	const classNames = removeNonStringsAndTrim(`[grid-area:body]`, classString)
	return <div class={classNames}>{children}</div>
}

export const Footer = ({ children, class: classString }: LayoutComponentProps) => {
	const classNames = removeNonStringsAndTrim(`[grid-area:footer]`, classString)
	return <div class={classNames}>{children}</div>
}
