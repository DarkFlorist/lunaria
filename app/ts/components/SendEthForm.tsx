import { ComponentChildren } from 'preact';
import { AddressField } from './AddressField';
import { AmountField } from './AmountField';

type SendEthInput = {
	amount: string;
	to: string;
};

type SendEthFormProps = {
	disabled?: boolean;
	data: SendEthInput;
	onChange: (data: Partial<SendEthInput>) => void;
	onSubmit?: (event: Event) => void;
	infoTitle: string;
	children: ComponentChildren;
};

export const SendEthForm = ({
	data,
	disabled = false,
	onChange,
	onSubmit,
	infoTitle,
	children,
}: SendEthFormProps) => {
	return (
		<form onSubmit={onSubmit}>
			<div class='flex flex-col lg:flex-row gap-6 px-8 md:pr-0'>
				<div class='flex flex-col gap-6 grow'>
					<AmountField
						name='amount'
						label='Send Amount'
						value={data.amount}
						onChange={(amount) => onChange({ amount })}
						disabled={disabled}
					/>
					<AddressField
						name='address'
						label='Recipient Address'
						value={data.to}
						onChange={(to) => onChange({ to })}
						disabled={disabled}
					/>
				</div>
				<div class='lg:w-[40%] py-4 px-6 border border-white/10 text-center lg:text-left'>
					<div class='text-lg font-bold mb-3 leading-tight'>{infoTitle}</div>
					<div class='text-sm mb-3'>{children}</div>
				</div>
			</div>
		</form>
	);
};
