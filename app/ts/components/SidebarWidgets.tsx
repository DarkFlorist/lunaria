import { ComponentChildren } from 'preact';

type InfoProps = {
	title: string;
	body: ComponentChildren;
};

export const Info = ({ title, body }: InfoProps) => {
	return (
		<div class='flex flex-col items-center md:items-start gap-1 mb-6'>
			<div class='uppercase text-white/50 text-xs md:text-sm'>{title}</div>
			<div class='text-lg font-bold'>{body}</div>
		</div>
	);
};

type LinkProps = {
	children: ComponentChildren;
	to?: string;
};

const Link = ({ children, to }: LinkProps) => (
	<a
		href={to}
		tabIndex={0}
		class='outline-none list-item hover:text-white focus:text-white'
	>
		{children}
	</a>
);

export const HelpCenter = () => {
	return (
		<div class='mb-6'>
			<div class='text-lg font-bold mb-3'>Help Center</div>
			<div class='flex flex-col text-white/50 list-inside mb-3'>
				<Link>What is a web3 wallet?</Link>
				<Link>How do i get a web3 wallet?</Link>
				<Link>Why do i need a tool for my wallet?</Link>
				<Link>How do i add a wallet?</Link>
			</div>
			<div>
				<a
					href='/'
					class='text-sm text-white underline-offset-4 hover:underline'
				>
					Visit FAQs
				</a>
			</div>
		</div>
	);
};

export const Support = () => {
	return (
		<div class='border-l-4 border-white/10 py-3 px-6 hover:bg-white/5 hover:cursor-pointer mb-6'>
			<div class='font-bold text-lg mb-2'>Need support in person?</div>
			<div class='text-sm text-white/50 mb-2'>
				We have a dedicated 24/7 in-person support ready to help you.
			</div>
			<a>Learn more</a>
		</div>
	);
};

export const UserTips = () => {
	return (
		<div class='md:border-l-4 md:border-white/10 py-3 px-6 bg-white/5 hover:cursor-pointer mb-6 text-center md:text-left'>
			<div class='font-bold text-lg mb-2'>Tip!</div>
			<div class='text-sm text-white/50 mb-2'>
				Refresh your balance before doing any transactions. Simply click on the
				refresh icon besides the balance value to update.
			</div>
		</div>
	);
};
