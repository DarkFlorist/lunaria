import { ethers } from 'ethers';
import { useEffect } from 'preact/hooks';
import { AsyncProperty } from '../../library/preact-utilities';
import { useNotify } from '../Notifier/useNotify';

type Props = {
	transaction: AsyncProperty<ethers.providers.TransactionResponse>;
};

export const Reporter = ({ transaction: txn }: Props) => {
	const { notify } = useNotify();

	useEffect(() => {
		if (txn.state === 'rejected') {
			notify({ message: txn.error.message });
		}

		if (txn.state === 'resolved') {
			notify({ message: 'Transaction sent!' });
		}
	}, [txn.state]);

	return null;
};
