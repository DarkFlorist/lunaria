import { useSignal } from '@preact/signals';
import { useAsyncState } from '../library/preact-utilities';
import { parseAddress, CustomJsonRpcError } from '../library/utilities';
import useWallet, {
	HexString,
	SendEthStatus,
	TransactionResponse,
} from '../library/useWallet';
import Icon from './Icon';
import Layout from './Layout';
import { EthBalance } from './EthBalance';
import { Branding } from './Branding';
import { Connect } from './Connect';
import { SocialLinks } from './SocialLinks';
import { ActiveNetwork } from './ActiveNetwork';
import { Support, UserTips } from './SidebarWidgets';
import { Button } from './Button';
import { SendEthReport } from './SendEthReport';
import { SendEthForm } from './SendEthForm';

export const SendEthPage = () => {
	return (
		<Layout>
			<Header />
			<Main />
			<Sidebar />
			<Footer />
		</Layout>
	);
};

export type SendTransactionInput = {
	amount: string;
	to: string;
};

const Main = () => {
	const wallet = useWallet();

	const formData = useSignal<SendTransactionInput>({
		amount: '',
		to: '',
	});

	function handleChange(data: Partial<SendTransactionInput>) {
		formData.value = { ...formData.value, ...data };
	}

	switch (wallet.status) {
		case 'unknown':
			// not much to see here, skipping render
			return null;
		case 'disconnected':
			return (
				<Layout.Main>
					<TitleField />
					<SendEthForm
						data={formData.value}
						onChange={handleChange}
						infoTitle='Review and Submit'
					>
						<div class='text-sm mb-3 text-white/50'>
							Connect a wallet to continue sending this transaction.
						</div>
						<Button onClick={wallet.connect!} class='w-full py-3' type='button'>
							Connect Wallet
						</Button>
					</SendEthForm>
				</Layout.Main>
			);

		case 'connected':
			return (
				<Layout.Main>
					<TitleField />
					<DynamicSendEthForm
						data={formData.value}
						onChange={handleChange}
						sendFn={wallet.sendEth!}
						getStatusFn={wallet.getSendEthStatus!}
					/>
				</Layout.Main>
			);
	}
};

type DynamicSendEthFormProps = {
	data: SendTransactionInput;
	onChange: (data: Partial<SendTransactionInput>) => void;
	sendFn: (to: HexString, amount: string) => Promise<TransactionResponse>;
	getStatusFn: (transaction: TransactionResponse) => Promise<SendEthStatus>;
};

const DynamicSendEthForm = ({
	data,
	onChange,
	sendFn,
	getStatusFn,
}: DynamicSendEthFormProps) => {
	const [transaction, mutateTransactionFn, resetTransaction] =
		useAsyncState<TransactionResponse>();

	function handleSend(e: Event) {
		e.preventDefault();
		const address = parseAddress(data.to);
		const to = data.amount;
		mutateTransactionFn(async () => sendFn(address, to));
	}

	switch (transaction.state) {
		case 'inactive': {
			return (
				<SendEthForm
					data={data}
					onChange={onChange}
					onSubmit={handleSend}
					infoTitle='Review and Submit'
				>
					<div class='text-sm mb-3 text-white/50'>
						Your currently installed web3 wallet will ask you to confirm this
						transaction after clicking the confirm button.
					</div>
					<div class='text-sm text-white/50 mb-3'>
						Review the details carefully!
					</div>
					<Button class='w-full py-3' type='submit'>
						Confirm Send
					</Button>
				</SendEthForm>
			);
		}

		case 'pending': {
			return (
				<SendEthForm
					data={data}
					onChange={onChange}
					infoTitle='Confirm Send'
					disabled={true}
				>
					<div class='text-white/50 my-3'>
						Complete this process by confirming the transaction on your
						installed web3 wallet.
					</div>
					<div class='text-white/50 my-3'>
						A confirmation window should automatically popup. Check your wallet
						extension otherwise.
					</div>
					<div class='my-3 flex items-center justify-center lg:justify-start gap-2'>
						Awaiting Confirmation <Icon.Loading />
					</div>
				</SendEthForm>
			);
		}

		case 'rejected': {
			const error = new CustomJsonRpcError(transaction.error);
			return (
				<SendEthForm data={data} onChange={onChange} infoTitle='Send Failed!'>
					<div class='text-white/50 my-3'>
						The transaction returned with an error code{' '}
						<span class='text-white'>{error.code}</span>
					</div>
					<div class='text-white/50 my-3'>Do you want to retry?</div>
					<Button class='w-full py-3' onClick={resetTransaction}>
						Yes, Retry
					</Button>
				</SendEthForm>
			);
		}

		case 'resolved': {
			const getStatus = async () => await getStatusFn(transaction.value);
			return (
				<SendEthReport
					transaction={transaction.value}
					data={data}
					getStatusFn={getStatus}
					onExit={resetTransaction}
				/>
			);
		}
	}
};

const TitleField = () => {
	return (
		<div class='h-14 flex items-center justify-between bg-white/10 px-8 mb-8'>
			<div class='text-lg font-bold'>Send ETH</div>
		</div>
	);
};

const Header = () => {
	return (
		<Layout.Header>
			<div class='md:flex md:gap-6'>
				<Branding />
				<Connect />
			</div>
		</Layout.Header>
	);
};

const Sidebar = () => {
	return (
		<Layout.Aside>
			<ActiveNetwork />
			<EthBalance />
			<UserTips />
			<Support />
		</Layout.Aside>
	);
};

const Footer = () => {
	return (
		<Layout.Footer>
			<SocialLinks />
		</Layout.Footer>
	);
};
