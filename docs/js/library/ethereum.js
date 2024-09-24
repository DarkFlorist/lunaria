import { Interface, id, toQuantity } from 'ethers';
import { ERC20ABI } from './ERC20ABI.js';
export function withEip1193Provider(global) {
    return global !== null && typeof global === 'object' && 'ethereum' in global && global.ethereum !== null && typeof global.ethereum === 'object' && 'request' in global.ethereum && typeof global.ethereum.request === 'function';
}
export function isEthereumProvider(ethereum) {
    return ethereum !== null && typeof ethereum === 'object' && 'on' in ethereum && typeof ethereum.on === 'function' && 'removeListener' in ethereum && typeof ethereum.removeListener === 'function';
}
export const erc20Interface = new Interface(ERC20ABI);
export const transferSignature = id('Transfer(address,address,uint256)');
export const isTransferTopic = (topic) => topic === transferSignature;
export const ERC20Interface = new Interface(ERC20ABI);
export const parseERC20ReceiptLog = ({ topics, data }) => ERC20Interface.parseLog({ topics: [...topics], data });
export function extractERC20TransferRequest(receipt) {
    // receipt should have a recipient
    if (!receipt.to)
        return;
    for (const log of receipt.logs) {
        const parsedLog = parseERC20ReceiptLog(log);
        // log is a "Transfer" method
        if (parsedLog === null || parsedLog.name !== 'Transfer')
            return;
        // if an arg was not defined, fail the next conditions
        const logFrom = parsedLog.args["from"];
        const logTo = parsedLog.args["to"];
        const logValue = parsedLog.args["value"];
        // a transfer that originates from which the receipt was initiated
        if (BigInt(logFrom) !== BigInt(receipt.from))
            return;
        // recipient is the contract address
        if (BigInt(receipt.to) !== BigInt(log.address))
            return;
        return { contractAddress: log.address, from: receipt.from, to: logTo, quantity: toQuantity(logValue) };
    }
    return;
}
//# sourceMappingURL=ethereum.js.map