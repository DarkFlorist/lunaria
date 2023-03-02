import { useSignal } from '@preact/signals'
import { TransferProvider } from '../../context/Transfer.js'
import { SelectAsset } from './AssetListing.js'
import { ReviewWidget, SupportWidget } from './Widgets.js'
import { FormActions, TransferAddressField, TransferAmountField, TransferForm } from './FormFields.js'
import { ActiveAssetDetail } from './ActiveAsset.js'
import { Branding } from '../Branding.js'
import { ConnectToWallet } from '../ConnectToWallet.js'
import { SocialLinks } from '../SocialLinks.js'
import { ActiveNetwork } from '../ActiveNetwork.js'

export const TransferPage = () => {
	const mobileVisibility = useSignal(true)

	return (
		<TransferProvider>
			<div class='bg-main fixed inset-0 text-white'>
				<div class='absolute inset-0 overflow-y-auto grid [grid-template-areas:_"header"_"aside"_"main"_"footer"] md:[grid-template-areas:_"header_header"_"aside_main"_"footer_footer"] md:grid-rows-[min-content_1fr_min-content] md:grid-cols-[2fr_5fr]'>
					<div style={{ gridArea: 'header' }}>
						<div class='grid px-4 py-4 gap-y-4 md:grid-cols-2'>
							<Branding />
							<ConnectToWallet />
						</div>
					</div>
					<div style={{ gridArea: 'aside' }}>
						<ActiveNetwork />
						<SelectAsset mobileVisibility={mobileVisibility} />
					</div>
					<div style={{ gridArea: 'main' }}>
						<div class='border border-white/20 mx-4 md:ml-0'>
							<TransferForm>
								<div class='px-4 py-2'>Transfer Asset</div>
								<ActiveAssetDetail onChange={() => (mobileVisibility.value = true)} />
								<div class='grid [grid-template-areas:_"form"_"review"_"action"_"support"] lg:[grid-template-areas:_"form_review"_"action_review"_"action_support"] lg:grid-cols-[3fr_minmax(0,2fr)] grid-rows-[minmax(min-content,auto)_minmax(min-content,auto)] gap-y-6 gap-x-6 px-6 py-6'>
									<div style={{ gridArea: 'form' }}>
										<div class='grid gap-3'>
											<TransferAmountField />
											<TransferAddressField />
										</div>
									</div>
									<div style={{ gridArea: 'review' }}>
										<ReviewWidget />
									</div>
									<div style={{ gridArea: 'action' }}>
										<FormActions />
									</div>
									<div style={{ gridArea: 'support' }}>
										<SupportWidget />
									</div>
								</div>
							</TransferForm>
						</div>
					</div>
					<div style={{ gridArea: 'footer' }}>
						<div class='py-6'>
							<SocialLinks />
						</div>
					</div>
				</div>
			</div>
		</TransferProvider>
	)
}
