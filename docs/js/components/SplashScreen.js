import { Fragment as _Fragment, jsx as _jsx } from "preact/jsx-runtime";
import { useEffect } from 'preact/hooks';
export const SplashScreen = ({ children }) => {
    executeSplashExit();
    return _jsx(_Fragment, { children: children });
};
function executeSplashExit() {
    useEffect(() => {
        const selectorHiddenClassName = 'splash-screen--off';
        const element = document.querySelector('.splash-screen');
        if (element === null || element.classList.contains(selectorHiddenClassName))
            return;
        element.classList.add(selectorHiddenClassName);
    }, []);
}
//# sourceMappingURL=SplashScreen.js.map