import { Component, JSX, ErrorInfo } from 'preact'

interface Props {
	children: JSX.Element | JSX.Element[]
}

type State = { hasError: false } | { hasError: true; error: Error }

class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// connect to logging service
		console.error(error, errorInfo)
	}

	render() {
		if (!this.state.hasError) return this.props.children

		return (
			<div class='w-full my-[10%] flex justify-center'>
				<div class='border border-red-400/20 bg-red-400/5 p-4 text-center max-w-lg'>
					<div class='text-xl font-bold'>Uh oh, this is unexpected...</div>
					<div class='text-white/50 text-sm my-4'>Not to worry. Drop by our disord channel and provide us with the hint below so we can help resolve your issue faster. Appreciate your support and look forward to seeing you there.</div>
					<div class='border border-red-400/20 px-4 py-3 bg-black/10 text-white/80 text-sm'>{this.state.error.message}</div>
				</div>
			</div>
		)
	}
}

export default ErrorBoundary
