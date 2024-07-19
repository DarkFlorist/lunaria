import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { Component } from 'preact';
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        // connect to logging service
        console.error(error, errorInfo);
    }
    render() {
        if (!this.state.hasError)
            return this.props.children;
        return (_jsx("div", { class: 'w-full my-[10%] flex justify-center', children: _jsxs("div", { class: 'border border-red-400/20 bg-red-400/5 p-4 text-center max-w-lg', children: [_jsx("div", { class: 'text-xl font-bold', children: "Uh oh, this is unexpected..." }), _jsx("div", { class: 'text-white/50 text-sm my-4', children: "Not to worry. Drop by our disord channel and provide us with the hint below so we can help resolve your issue faster. Appreciate your support and look forward to seeing you there." }), _jsx("div", { class: 'border border-red-400/20 px-4 py-3 bg-black/10 text-white/80 text-sm', children: this.state.error.message })] }) }));
    }
}
export default ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map