import { getAddress, isError, isHexString, parseUnits } from 'ethers'
import * as funtypes from 'funtypes'

export function createCacheParser<T>(funType: funtypes.Codec<T>) {
	const config: funtypes.ParsedValue<funtypes.String, T>['config'] = {
		parse(value) {
			const jsonParsed = JSON.parse(value)
			return funType.safeParse(jsonParsed)
		},
		serialize(value) {
			const serializedValue = funType.safeSerialize(value)
			if (!serializedValue.success) return { success: false, message: serializedValue.message }
			const jsonString = JSON.stringify(serializedValue.value)
			return { success: true, value: jsonString }
		},
	}
	return config
}

export const BigIntParser: funtypes.ParsedValue<funtypes.String, bigint>['config'] = {
	parse(value) {
		if (!/^0x([a-fA-F0-9]{1,64})$/.test(value)) return { success: false, message: `${value} is not a hex string encoded number.` }
		return { success: true, value: BigInt(value) }
	},
	serialize(value) {
		if (typeof value !== 'bigint') return { success: false, message: `${typeof value} is not a bigint.` } satisfies funtypes.Failure
		return { success: true, value: `0x${value.toString(16)}` } satisfies funtypes.Success<string>
	},
}

export const BigIntHex = funtypes.String.withParser(BigIntParser)

export const HexString = funtypes.String.withGuard(isHexString)
export type HexString = funtypes.Static<typeof HexString>

export function createUnitParser(decimals?: bigint): funtypes.ParsedValue<funtypes.String, HexString>['config'] {
	return {
		parse(value) {
			try {
				const bigIntAmount = parseUnits(value, decimals)
				const maybeHexAmount = BigIntHex.serialize(bigIntAmount)
				return HexString.safeParse(maybeHexAmount)
			} catch {
				return { success: false, message: `${value} is not a number.` }
			}
		},
		serialize: funtypes.String.safeParse,
	}
}

export const AddressParser: funtypes.ParsedValue<funtypes.String, string>['config'] = {
	parse: value => {
		try {
			const checksummedAddress = getAddress(value)
			return { success: true, value: checksummedAddress }
		} catch(error) {
			let errorMessage =`${value} is not a valid address.`
			if (isError(error, 'INVALID_ARGUMENT') && error.message.includes('bad address checksum')) { errorMessage = 'Invalid address checksum.' }
			return { success: false, message: errorMessage }
		}
	},
	serialize: funtypes.String.safeParse,
}

export const EthereumAddress = funtypes.String.withParser(AddressParser).withGuard(isHexString)
export type EthereumAddress = funtypes.Static<typeof EthereumAddress>

export const ERC20Token = funtypes.Object({
	chainId: BigIntHex,
	name: funtypes.String,
	address: EthereumAddress,
	symbol: funtypes.String,
	decimals: BigIntHex,
})

export type ERC20Token = funtypes.Static<typeof ERC20Token>

export const TransferSchema = funtypes.Object({
	hash: funtypes.String,
	from: EthereumAddress,
	to: EthereumAddress,
	amount: BigIntHex,
	token: ERC20Token.Or(funtypes.Undefined),
	date: funtypes.Number,
})

export type Transfer = funtypes.Static<typeof TransferSchema>

export const TransferRequestInput = funtypes.Object({
	to: EthereumAddress,
	amount: BigIntHex,
	token: ERC20Token.Or(funtypes.Undefined),
})

export type TransferRequestInput = funtypes.Static<typeof TransferRequestInput>

export const TokensCacheSchema = funtypes.Union(
	funtypes.Object({
		data: funtypes.Array(ERC20Token),
		version: funtypes.Literal('1.0.0'),
	})
)

export type TokensCache = funtypes.Static<typeof TokensCacheSchema>

export const Holdings = funtypes.Array(EthereumAddress)
export type Holdings = funtypes.Static<typeof Holdings>

const AccountSettings = funtypes.Object({
	address: EthereumAddress,
	holdings: Holdings
})

export type AccountSettings = funtypes.Static<typeof AccountSettings>

export const SettingsCacheSchema = funtypes.Union(
	funtypes.Object({
		data: funtypes.Array(AccountSettings),
		version: funtypes.Literal('1.0.0'),
	})
)

export type SettingsCache = funtypes.Static<typeof SettingsCacheSchema>

export function serialize<T, U extends funtypes.Codec<T>>(funType: U, value: T) {
	return funType.serialize(value) as ToWireType<U>
}

export function safeSerialize<T, U extends funtypes.Codec<T>>(funType: U, value: T) {
	return funType.safeSerialize(value) as funtypes.Result<ToWireType<U>>
}

export type UnionToIntersection<T> = (T extends unknown ? (k: T) => void : never) extends (k: infer I) => void ? I : never

export type ToWireType<T> = T extends funtypes.Intersect<infer U>
	? UnionToIntersection<{ [I in keyof U]: ToWireType<U[I]> }[number]>
	: T extends funtypes.Union<infer U>
	? { [I in keyof U]: ToWireType<U[I]> }[number]
	: T extends funtypes.Record<infer U, infer V>
	? Record<funtypes.Static<U>, ToWireType<V>>
	: T extends funtypes.Partial<infer U, infer V>
	? V extends true
	? { readonly [K in keyof U]?: ToWireType<U[K]> }
	: { [K in keyof U]?: ToWireType<U[K]> }
	: T extends funtypes.Object<infer U, infer V>
	? V extends true
	? { readonly [K in keyof U]: ToWireType<U[K]> }
	: { [K in keyof U]: ToWireType<U[K]> }
	: T extends funtypes.Readonly<funtypes.Tuple<infer U>>
	? { readonly [P in keyof U]: ToWireType<U[P]> }
	: T extends funtypes.Tuple<infer U>
	? { [P in keyof U]: ToWireType<U[P]> }
	: T extends funtypes.ReadonlyArray<infer U>
	? readonly ToWireType<U>[]
	: T extends funtypes.Array<infer U>
	? ToWireType<U>[]
	: T extends funtypes.ParsedValue<infer U, infer _>
	? ToWireType<U>
	: T extends funtypes.Codec<infer U>
	? U
	: never

export const TransferRequest = funtypes.Object({
	contractAddress: EthereumAddress.Or(funtypes.Undefined),
	from: EthereumAddress,
	to: EthereumAddress,
	quantity: BigIntHex
})

export type TransferRequest = funtypes.Static<typeof TransferRequest>

export const TransferTemplate = funtypes.Intersect(TransferRequest, funtypes.Object({ label: funtypes.String.Or(funtypes.Undefined) }))
export type TransferTemplate = funtypes.Static<typeof TransferTemplate>

export const TemplatesCacheSchema = funtypes.Union(
	funtypes.Object({
		data: funtypes.Array(TransferTemplate),
		version: funtypes.Literal('1.0.0'),
	})
)

export type TemplatesCache = funtypes.Static<typeof TemplatesCacheSchema>
