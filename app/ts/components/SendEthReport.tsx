import { useAsyncState } from '../library/preact-utilities';
import { SendEthStatus, TransactionResponse } from '../library/useWallet';
import { Button } from './Button';
import Icon from './Icon';

type SendEthInput = {
	to: string;
	amount: string;
};

type SendEthReportProps = {
	getStatusFn: () => Promise<SendEthStatus>;
	data: SendEthInput;
	onExit: () => void;
	transaction: TransactionResponse;
};

export const SendEthReport = ({
	getStatusFn,
	data,
	onExit,
	transaction,
}: SendEthReportProps) => {
	const [receipt, queryReceiptFn] = useAsyncState<SendEthStatus>();

	switch (receipt.state) {
		case 'inactive':
			queryReceiptFn(getStatusFn);
			return null;

		case 'pending':
			return (
				<div class='px-8 md:pr-0'>
					<div class='flex items-center border border-white/30 mb-6 rounded'>
						<div class='flex items-center justify-center w-20 h-20 shrink-0'>
							<div class='border-2 rounded-full w-12 h-12 flex items-center justify-center text-3xl'>
								<Icon.Loading />
							</div>
						</div>
						<div class='flex flex-col items-start justify-center p-4 border-l border-white/30'>
							<div class='text-xl font-bold leading-tight'>
								Sending in progress
							</div>
							<div class='text-white/50 text-sm text-left'>
								This should take a moment to complete. The information below
								will automatically update once the transaction completes.
							</div>
						</div>
					</div>

					<div class='flex flex-wrap justify-center items-center gap-y-6 gap-x-8 my-8'>
						<div class='text-xl md:text-2xl flex-[0_0_100%] text-center'>
							Transaction Information
						</div>
						<div class='flex-[0_0_100%] flex flex-col items-center'>
							<div class='text-white/50 text-xs uppercase'>
								Address to receive ETH
							</div>
							<button class='font-bold flex items-center gap-1'>
								{data.to}
								<Icon.Copy />
							</button>
						</div>
						<div class='flex flex-col items-center'>
							<div class='text-white/50 text-xs uppercase'>
								Amount being sent
							</div>
							<div class='font-bold'>{data.amount}</div>
						</div>
						<div class='flex-[0_0_100%] flex flex-col items-center'>
							<button
								class='font-bold flex items-center gap-1 underline underline-offset-4'
								title={transaction.hash}
							>
								Copy transaction ID
							</button>
						</div>
						<div class='flex-[0_0_100%] flex flex-col items-center'>
							<button
								class='font-bold flex items-center gap-1 underline underline-offset-4'
								title={transaction.hash}
							>
								View transaction in block explorer
							</button>
						</div>
					</div>
				</div>
			);

		case 'rejected':
			return (
				<div class='px-8 md:pr-0'>
					<div class='flex items-center border border-white/30 mb-6'>
						<div class='flex items-center justify-center w-20 h-20 shrink-0'>
							<div class='border-2 rounded-full w-12 h-12 flex items-center justify-center text-3xl'>
								<Icon.Xmark />
							</div>
						</div>
						<div class='flex flex-col items-start justify-center p-4 border-l border-white/30'>
							<div class='text-xl font-bold leading-tight'>Sending Failed!</div>
							<div class='text-white/50 text-sm'>{receipt.error.message}</div>
						</div>
					</div>

					<div class='flex flex-wrap justify-center items-center gap-y-6 gap-x-8 my-8'>
						<div class='text-xl md:text-2xl flex-[0_0_100%] text-center'>
							Transaction Information
						</div>
						<div class='flex-[0_0_100%] flex flex-col items-center'>
							<div class='text-white/50 text-xs uppercase'>
								Address to receive ETH
							</div>
							<button class='font-bold flex items-center gap-1'>
								{data.to}
								<Icon.Copy />
							</button>
						</div>
						<div class='flex flex-col items-center'>
							<div class='text-white/50 text-xs uppercase'>
								Attempted amount to send
							</div>
							<div class='font-bold'>{data.amount}</div>
						</div>
						<div class='flex-[0_0_100%] flex flex-col items-center'>
							<button
								class='font-bold flex items-center gap-1 underline underline-offset-4'
								title={transaction.hash}
							>
								Copy transaction ID
							</button>
						</div>
						<div class='flex-[0_0_100%] flex flex-col items-center'>
							<button
								class='font-bold flex items-center gap-1 underline underline-offset-4'
								title={transaction.hash}
							>
								View transaction in block explorer
							</button>
						</div>
						<div class='flex-[0_0_100%] flex flex-col items-center'>
							<Button onClick={onExit}>Send again?</Button>
						</div>
					</div>
				</div>
			);

		case 'resolved':
			return (
				<div class='px-8 md:pr-0'>
					<div class='flex items-center border border-white/30 mb-6 rounded'>
						<div class='flex items-center justify-center w-20 h-20 shrink-0'>
							<div class='border-2 rounded-full w-12 h-12 flex items-center justify-center text-3xl'>
								<Icon.Check />
							</div>
						</div>
						<div class='flex flex-col items-start justify-center p-4 border-l border-white/30'>
							<div class='text-xl font-bold leading-tight'>Send Complete!</div>
							<div class='text-white/50 text-sm'>
								Transaction completed successfully with the details outlined
								below.
							</div>
						</div>
					</div>

					<div class='flex flex-wrap justify-center items-center gap-y-6 gap-x-8 my-8'>
						<div class='text-xl md:text-2xl flex-[0_0_100%] text-center'>
							Transaction Information
						</div>
						<div class='flex-[0_0_100%] flex flex-col items-center'>
							<div class='text-white/50 text-xs uppercase'>
								Recipient Address
							</div>
							<button class='font-bold flex items-center gap-1'>
								{receipt.value.to}
								<Icon.Copy />
							</button>
						</div>
						<div class='flex flex-col items-center'>
							<div class='text-white/50 text-xs uppercase'>Amount Sent</div>
							<div class='font-bold'>{data.amount} ETH</div>
						</div>
						<div class='flex flex-col items-center'>
							<div class='text-white/50 text-xs uppercase'>Transaction Fee</div>
							<div class='font-bold'>{receipt.value.fee} ETH</div>
						</div>
						<div class='flex-[0_0_100%] flex flex-col items-center'>
							<button
								class='font-bold flex items-center gap-1 underline underline-offset-4'
								title={receipt.value.hash}
							>
								Copy transaction ID
							</button>
						</div>
						<div class='flex-[0_0_100%] flex flex-col items-center'>
							<button
								class='font-bold flex items-center gap-1 underline underline-offset-4'
								title={receipt.value.hash}
							>
								View transaction in block explorer
							</button>
						</div>
						<div class='flex-[0_0_100%] flex flex-col items-center'>
							<Button onClick={onExit}>Send again?</Button>
						</div>
					</div>
				</div>
			);
	}
};
