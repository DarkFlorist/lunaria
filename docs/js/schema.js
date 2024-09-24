import { getAddress, isError, isHexString, parseUnits } from 'ethers';
import * as funtypes from 'funtypes';
export function createCacheParser(funType) {
    const config = {
        parse(value) {
            const jsonParsed = JSON.parse(value);
            return funType.safeParse(jsonParsed);
        },
        serialize(value) {
            const serializedValue = funType.safeSerialize(value);
            if (!serializedValue.success)
                return { success: false, message: serializedValue.message };
            const jsonString = JSON.stringify(serializedValue.value);
            return { success: true, value: jsonString };
        },
    };
    return config;
}
export const BigIntParser = {
    parse(value) {
        if (!/^0x([a-fA-F0-9]{1,64})$/.test(value))
            return { success: false, message: `${value} is not a hex string encoded number.` };
        return { success: true, value: BigInt(value) };
    },
    serialize(value) {
        if (typeof value !== 'bigint')
            return { success: false, message: `${typeof value} is not a bigint.` };
        return { success: true, value: `0x${value.toString(16)}` };
    },
};
export const BigIntHex = funtypes.String.withParser(BigIntParser);
export const HexString = funtypes.String.withGuard(isHexString);
export function createUnitParser(decimals) {
    return {
        parse(value) {
            try {
                const bigIntAmount = parseUnits(value, decimals);
                const maybeHexAmount = BigIntHex.serialize(bigIntAmount);
                return HexString.safeParse(maybeHexAmount);
            }
            catch {
                return { success: false, message: `${value} is not a number.` };
            }
        },
        serialize: funtypes.String.safeParse,
    };
}
export const AddressParser = {
    parse: value => {
        try {
            const checksummedAddress = getAddress(value);
            return { success: true, value: checksummedAddress };
        }
        catch (error) {
            let errorMessage = `${value} is not a valid address.`;
            if (isError(error, 'INVALID_ARGUMENT') && error.message.includes('bad address checksum')) {
                errorMessage = 'Invalid address checksum.';
            }
            return { success: false, message: errorMessage };
        }
    },
    serialize: funtypes.String.safeParse,
};
export const EthereumAddress = funtypes.String.withParser(AddressParser).withGuard(isHexString);
export const ERC20Token = funtypes.Object({
    chainId: BigIntHex,
    name: funtypes.String,
    address: EthereumAddress,
    symbol: funtypes.String,
    decimals: BigIntHex,
});
export const TransferSchema = funtypes.Object({
    hash: funtypes.String,
    from: EthereumAddress,
    to: EthereumAddress,
    amount: BigIntHex,
    token: ERC20Token.Or(funtypes.Undefined),
    date: funtypes.Number,
});
export const TransferRequestInput = funtypes.Object({
    to: EthereumAddress,
    amount: BigIntHex,
    token: ERC20Token.Or(funtypes.Undefined),
});
export const TokensCacheSchema = funtypes.Union(funtypes.Object({
    data: funtypes.Array(ERC20Token),
    version: funtypes.Literal('1.0.0'),
}));
export const Holdings = funtypes.Array(EthereumAddress);
const AccountSettings = funtypes.Object({
    address: EthereumAddress,
    holdings: Holdings
});
export const SettingsCacheSchema = funtypes.Union(funtypes.Object({
    data: funtypes.Array(AccountSettings),
    version: funtypes.Literal('1.0.0'),
}));
export function serialize(funType, value) {
    return funType.serialize(value);
}
export function safeSerialize(funType, value) {
    return funType.safeSerialize(value);
}
export const TransferRequest = funtypes.Object({
    contractAddress: EthereumAddress.Or(funtypes.Undefined),
    from: EthereumAddress,
    to: EthereumAddress,
    quantity: BigIntHex
});
export const TransferTemplate = funtypes.Intersect(TransferRequest, funtypes.Object({ label: funtypes.String.Or(funtypes.Undefined) }));
export const TemplatesCacheSchema = funtypes.Union(funtypes.Object({
    data: funtypes.Array(TransferTemplate),
    version: funtypes.Literal('1.0.0'),
}));
//# sourceMappingURL=schema.js.map