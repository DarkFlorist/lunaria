type NoticeProps = {
	message: string;
	onClose: () => void;
};

export const Notice = ({ message, onClose }: NoticeProps) => {
	return (
		<div class='shadow-md py-2 px-4 rounded flex items-center gap-4 bg-white/90 border border-gray-100 w-full max-w-lg'>
			<div class='grow leading-tight border-r border-black/10 py-2'>
				{message}
			</div>
			<button class='py-2' onClick={onClose}>
				&#x2715;
			</button>
		</div>
	);
};
