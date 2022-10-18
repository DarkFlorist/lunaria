import { JSX } from 'preact/jsx-runtime';
import useWallet from '../library/useWallet';
import { Connect } from './Connect';
import Icon from './Icon/index';
import { Notifier } from './Notifier/index';
import { Send } from './Send/index';

export function App() {
	const { accounts } = useWallet();

	if (accounts?.length) {
		return (
			<Shell>
				<div class='bg-white/5 p-8 rounded-lg w-full max-w-xs'>
					<h1 class='text-2xl font-bold'>Send ETH</h1>
					<Send from={accounts[0]} />
				</div>
			</Shell>
		);
	}

	return (
		<Shell>
			<div class='bg-white/5 p-8 rounded-lg'>
				<div class='flex flex-col items-center gap-6'>
					<div class='flex justify-center items-center text-[4rem]'>
						<Icon.Ethereum />
					</div>
					<Connect />
				</div>
			</div>
		</Shell>
	);
}

type ShellProps = JSX.HTMLAttributes<HTMLDivElement>;

const Shell = ({ children }: ShellProps) => {
	return (
		<main>
			<div class='bg-main fixed inset-0 overflow-y-scroll bg-black flex items-center justify-center text-white px-6'>
				{children}
			</div>
			<Notifier />
		</main>
	);
};
