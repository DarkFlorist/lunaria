import { ethers } from 'ethers'
import { ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { isExternalProvider } from '../library/utilities.js'
import { Web3Provider } from '../types.js'

const EthereumContext = createContext<Web3Provider | undefined>(undefined)

type EthereumProviderProps = {
	children: ComponentChildren
}
export const EthereumProvider = ({ children }: EthereumProviderProps) => {
	const provider = isExternalProvider(window.ethereum) ? new ethers.providers.Web3Provider(window.ethereum) : undefined
	return <EthereumContext.Provider value={provider}>{children}</EthereumContext.Provider>
}

export function useEthereumProvider() {
	const context = useContext(EthereumContext)
	if (context === undefined) throw new Error('useEthereumContext can only be used within a child of EthereumProvider')
	return context
}
