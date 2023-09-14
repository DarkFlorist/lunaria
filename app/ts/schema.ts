import { getAddress } from 'ethers'
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

export const BigIntSchema = funtypes.String.withParser(BigIntParser)

export const AddressParser: funtypes.ParsedValue<funtypes.String, bigint>['config'] = {
	parse: value => {
		if (!/^0x([a-fA-F0-9]{40})$/.test(value)) return { success: false, message: `${value} is not a hex string encoded address.` }
		else return { success: true, value: BigInt(value) }
	},
	serialize: value => {
		if (typeof value !== 'bigint') return { success: false, message: `${typeof value} is not a bigint.`}
		return { success: true, value: getAddress(`0x${value.toString(16).padStart(40, '0')}`) }
	},
}

export const AddressSchema = funtypes.String.withParser(AddressParser)
export type Address = funtypes.Static<typeof AddressSchema>

export const QuantitySchema = funtypes.String.withParser(BigIntParser)
export type Amount = funtypes.Static<typeof QuantitySchema>

export const TokenSchema = funtypes.Object({
	chainId: BigIntSchema,
	name: funtypes.String,
	address: funtypes.String,
	symbol: funtypes.String,
	decimals: BigIntSchema,
})

export type Token = funtypes.Static<typeof TokenSchema>

export const TransferSchema = funtypes.Object({
	hash: funtypes.String,
	from: AddressSchema,
	to: AddressSchema,
	amount: QuantitySchema,
	token: funtypes.Union(TokenSchema, funtypes.Undefined),
	date: funtypes.Number,
})

export type Transfer = funtypes.Static<typeof TransferSchema>

export const TransferInputSchema = funtypes.Object({
	to: AddressSchema,
	amount: QuantitySchema,
	token: funtypes.Union(TokenSchema, funtypes.Undefined)
})

export type TransferInput = funtypes.Static<typeof TransferInputSchema>
