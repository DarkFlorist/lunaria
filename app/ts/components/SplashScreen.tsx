import { ComponentChildren } from "preact";
import { useEffect } from "preact/hooks";

type Props = {
	children: ComponentChildren
}

export const SplashScreen = ({ children }: Props) => {
	executeSplashExit();
	return <>{children}</>
}

function executeSplashExit() {
	useEffect(() => {
		const selectorHiddenClassName = 'splash-screen--off'

		const element = document.querySelector('.splash-screen')
		if (element === null || element.classList.contains(selectorHiddenClassName)) return
		element.classList.add(selectorHiddenClassName)
	}, [])
}
