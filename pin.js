const PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkYThiZjgyYi05Yjk0LTQ5NTYtYWFmYS1jODg0ZmMzYzc3MWIiLCJlbWFpbCI6Imp1YmFsLm1hYmFxdWlhb0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNTQ3NGEwZDc4NTZhZWZhNjExMWUiLCJzY29wZWRLZXlTZWNyZXQiOiI3YjI1NTJiYzY3ZWJiMTEyMzBkNjMzZjZlYWQzYWVlYjExMTYyNjYwYzE5ODVlZWZlZTYzYTYxM2ViYjEwZDljIiwiaWF0IjoxNzA0MTY2NDkyfQ.i33VkYWNIvgHvMA4_YPK9eTlye1-9pWDgxvIjqjJaUc'
const PINATA_GATEWAY = 'https://yellow-labour-ostrich-117.mypinata.cloud'
const IPFS_HASH = 'bafybeiajyjn6zx7rht6xxv37difjvl4oahjkmsfvikhabkobuzkq2utofe'

const pinFileToIPFS = async () => {
	try {
		data = JSON.stringify({
			"hashToPin": IPFS_HASH,
			"pinataMetadata": {
				"name": "Lunaria",
				"keyvalues": {
					"version": "0.0.0"
				}
			}
		})

		const res = await fetch('https://api.pinata.cloud/pinning/pinByHash', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${PINATA_JWT}`
			},
			body: data
		});

		console.log('pin response\n', await res.json())
		console.log('Visit Lunaria', `${PINATA_GATEWAY}/ipfs/${IPFS_HASH}`)
	} catch (error) {
		console.log(error)
	}
}

pinFileToIPFS()
