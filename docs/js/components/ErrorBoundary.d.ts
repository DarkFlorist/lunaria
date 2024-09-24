import { Component, JSX, ErrorInfo } from 'preact';
interface Props {
    children: JSX.Element | JSX.Element[];
}
type State = {
    hasError: false;
} | {
    hasError: true;
    error: Error;
};
declare class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props);
    static getDerivedStateFromError(error: Error): {
        hasError: boolean;
        error: Error;
    };
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    render(): JSX.Element | (JSX.Element[] & object);
}
export default ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.d.ts.map