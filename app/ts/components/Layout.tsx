import { ComponentChildren } from 'preact'

type LayoutComponentProps = { children: ComponentChildren }

export const Root = ({ children }: LayoutComponentProps) => {
	return (
		<div class='fixed bg-main inset-0'>
			<div class='fixed inset-0 bg-polka'></div>
			<div class='absolute inset-0 md:grid md:grid-cols-[3fr_2fr] lg:grid-cols-[5fr_3fr] xl:grid-cols-[5fr_2fr] grid-rows-[fit-content(9rem)_fit-content(10rem)_1fr_4rem] md:grid-rows-[8rem_1fr_4rem] text-white overflow-y-scroll'>
				{children}
			</div>
		</div>
	)
}

export const Header = ({ children }: LayoutComponentProps) => {
	return <div class='col-span-2 px-8 clear'>{children}</div>
}

export const Main = ({ children }: LayoutComponentProps) => {
	return <div class='col-span-2 md:col-span-1 overflow-y-scroll clear'>{children}</div>
}

export const Aside = ({ children }: LayoutComponentProps) => {
	return <div class='col-span-2 md:col-span-1 px-8'>{children}</div>
}

export const Footer = ({ children }: LayoutComponentProps) => {
	return <div class='h-16 col-span-2 flex items-center justify-center px-8'>{children}</div>
}
