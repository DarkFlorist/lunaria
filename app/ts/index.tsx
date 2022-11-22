import { render } from 'preact'
import { App } from './components/App'

render(<App />, document.body, document.querySelector('main') as HTMLElement)
