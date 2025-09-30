import { json } from '@sveltejs/kit';

/**
 * API endpoint to get encryption public key information
 * GET /api/public-key?address=0x...
 * 
 * Returns: {
 *   success: boolean,
 *   message: string,
 *   address?: string
 * }
 * 
 * Note: This endpoint doesn't actually retrieve the public key since that
 * requires MetaMask interaction which must happen on the client side.
 * This is mainly for validation and information purposes.
 */
export async function GET({ url }) {
	try {
		const address = url.searchParams.get('address');
		
		if (!address) {
			return json(
				{ success: false, error: 'Address parameter is required' }, 
				{ status: 400 }
			);
		}

		// Validate Ethereum address format
		const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
		if (!ethAddressRegex.test(address)) {
			return json(
				{ success: false, error: 'Invalid Ethereum address format' }, 
				{ status: 400 }
			);
		}

		console.log('🔍 Public key info requested for address:', address);

		return json({ 
			success: true, 
			message: 'To get the encryption public key, use eth_getEncryptionPublicKey from the client side with MetaMask',
			address: address,
			instructions: {
				clientSide: 'window.ethereum.request({ method: "eth_getEncryptionPublicKey", params: ["' + address + '"] })',
				note: 'This must be called from the browser with MetaMask connected'
			}
		});

	} catch (error) {
		console.error('❌ Public key info request failed:', error);
		return json(
			{ success: false, error: error.message }, 
			{ status: 500 }
		);
	}
}