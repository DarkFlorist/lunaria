import { useSignal } from '@preact/signals';
import { ethers } from 'ethers';
import { useAsyncState } from '../../library/preact-utilities';
import useWallet from '../../library/useWallet';
import { AddressField } from '../AddressField';
import { Balance } from '../Balance';
import { AmountField } from '../AmountField';
import { Reporter } from './Reporter';
import { useMemo } from 'preact/hooks';

type SendProps = {
	from: string;
};

export const Send = ({ from }: SendProps) => {
	const { sendTransaction } = useWallet();
	const [txn, queryTxn, resetTxn] =
		useAsyncState<ethers.providers.TransactionResponse>();

	const formData = useSignal({
		amount: undefined,
		destination: undefined,
	});

	function handleChange(e: Event) {
		const { name, value } = e.target as HTMLInputElement;
		formData.value = { ...formData.value, [name]: value };
	}

	async function sendTxn() {
		const { destination, amount } = formData.value;
		if (!amount) {
			throw new Error('Amount value is required.');
		}

		if (!destination) {
			throw new Error('Destination value is required.');
		}

		const transaction = await sendTransaction(destination, amount);
		resetTxn();
		return transaction;
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		queryTxn(sendTxn);
	}

	const isSubmitting = useMemo(() => txn.state === 'pending', [txn.state]);

	return (
		<form class='flex flex-col gap-2' onSubmit={handleSubmit}>
			<AddressField label='Source' value={from} disabled={isSubmitting} />
			<Balance address={from} />
			<hr class='opacity-20' />
			<AddressField
				name='destination'
				label='Destination'
				value={formData.value.destination || ''}
				onChange={handleChange}
				disabled={isSubmitting}
			/>
			<AmountField
				name='amount'
				label='Amount (ETH)'
				value={formData.value.amount}
				onChange={handleChange}
				disabled={txn.state === 'pending'}
			/>
			<div class='my-2'>
				<button
					disabled={isSubmitting}
					class='disabled:opacity-10'
					type='submit'
				>
					Submit
				</button>
			</div>
			<Reporter transaction={txn} />
		</form>
	);
};
