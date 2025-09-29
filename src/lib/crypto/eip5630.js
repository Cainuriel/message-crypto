/**
 * EIP-5630 Encryption Implementation using MetaMask Native Methods
 * 
 * This implementation uses exclusively MetaMask's native encryption/decryption methods:
 * - eth_getEncryptionPublicKey: Get user's encryption public key
 * - eth_encrypt: Encrypt data for a specific public key
 * - eth_decrypt: Decrypt data using user's private key
 * 
 * No external crypto libraries needed - everything is handled by MetaMask!
 */

export class EIP5630Crypto {
	/**
	 * Get encryption public key from MetaMask wallet
	 * This prompts the user to allow sharing their encryption public key
	 */
	static async getEncryptionPublicKey(signer) {
		try {
			console.log('🔑 Requesting encryption public key from MetaMask...');
			
			const address = await signer.getAddress();
			console.log('📍 Wallet address:', address);

			// Request encryption public key from MetaMask
			const publicKey = await signer.provider.request({
				method: 'eth_getEncryptionPublicKey',
				params: [address]
			});

			console.log('✅ Encryption public key obtained:', publicKey.substring(0, 20) + '...');
			return publicKey;

		} catch (error) {
			console.error('❌ Error getting encryption public key:', error);
			
			// Provide user-friendly error messages
			if (error.code === 4001) {
				throw new Error('❌ Usuario rechazó la solicitud de clave de encriptación');
			} else if (error.code === -32601) {
				throw new Error('❌ MetaMask no soporta eth_getEncryptionPublicKey. Actualiza MetaMask a la última versión.');
			} else if (error.message.includes('eth_getEncryptionPublicKey')) {
				throw new Error('❌ Función de encriptación no disponible en MetaMask. Verifica la versión.');
			} else {
				throw new Error(`❌ Error obteniendo clave de encriptación: ${error.message}`);
			}
		}
	}

	/**
	 * Encrypt message for a specific recipient using their public key
	 * Uses MetaMask's native encryption method
	 */
	static async encrypt(message, recipientPublicKey) {
		try {
			console.log('🔒 Starting encryption with MetaMask...');
			console.log('📝 Message length:', message.length, 'characters');
			console.log('🔑 Recipient public key:', recipientPublicKey.substring(0, 20) + '...');

			// Prepare data for MetaMask encryption
			const encryptionData = JSON.stringify({
				version: 'x25519-xsalsa20-poly1305',
				data: message
			});

			console.log('📦 Prepared data for encryption');

			// Use MetaMask's native encrypt method
			const encryptedData = await window.ethereum.request({
				method: 'eth_encrypt',
				params: [recipientPublicKey, encryptionData, 'x25519-xsalsa20-poly1305']
			});

			console.log('✅ Message encrypted successfully with MetaMask');
			
			// Ensure we return the expected format
			if (typeof encryptedData === 'string') {
				// Parse if MetaMask returned a JSON string
				return JSON.parse(encryptedData);
			} else {
				// Return as-is if already an object
				return encryptedData;
			}

		} catch (error) {
			console.error('❌ Encryption failed:', error);
			
			if (error.code === 4001) {
				throw new Error('❌ Usuario rechazó la solicitud de encriptación');
			} else if (error.code === -32601) {
				throw new Error('❌ MetaMask no soporta eth_encrypt. Actualiza MetaMask.');
			} else {
				throw new Error(`❌ Error en encriptación: ${error.message}`);
			}
		}
	}

	/**
	 * Decrypt message using user's private key via MetaMask
	 * This will prompt the user to approve the decryption
	 */
	static async decrypt(encryptedData, signer) {
		try {
			console.log('🔓 Starting decryption with MetaMask...');
			console.log('📦 Encrypted data version:', encryptedData.version);
			
			const address = await signer.getAddress();
			console.log('📍 Decrypting for address:', address);

			// Convert encrypted data to string if needed
			const encryptedString = typeof encryptedData === 'string' 
				? encryptedData 
				: JSON.stringify(encryptedData);

			console.log('🔍 Requesting decryption from MetaMask...');

			// Use MetaMask's native decrypt method
			const decryptedData = await signer.provider.request({
				method: 'eth_decrypt',
				params: [encryptedString, address]
			});

			console.log('✅ Decryption successful!');

			// Try to parse the decrypted data to extract the original message
			try {
				const parsedData = JSON.parse(decryptedData);
				if (parsedData.data) {
					console.log('📝 Extracted message from decrypted data');
					return parsedData.data;
				} else {
					return decryptedData;
				}
			} catch (parseError) {
				// If parsing fails, return the decrypted data as-is
				console.log('📝 Returning decrypted data as-is');
				return decryptedData;
			}

		} catch (error) {
			console.error('❌ Decryption failed:', error);
			
			if (error.code === 4001) {
				throw new Error('❌ Usuario rechazó la solicitud de desencriptación');
			} else if (error.code === -32601) {
				throw new Error('❌ MetaMask no soporta eth_decrypt. Actualiza MetaMask.');
			} else if (error.message.includes('decrypt')) {
				throw new Error('❌ No se pudo desencriptar el mensaje. Verifica que sea el destinatario correcto.');
			} else {
				throw new Error(`❌ Error en desencriptación: ${error.message}`);
			}
		}
	}

	/**
	 * Utility method to validate if MetaMask supports encryption
	 */
	static async checkMetaMaskEncryptionSupport() {
		try {
			if (typeof window.ethereum === 'undefined') {
				return { supported: false, reason: 'MetaMask no está instalado' };
			}

			// Check if MetaMask is connected
			const accounts = await window.ethereum.request({ method: 'eth_accounts' });
			if (accounts.length === 0) {
				return { supported: false, reason: 'MetaMask no está conectado' };
			}

			// Try to check if encryption methods are available
			// This is a simple check - the actual methods might still fail
			return { 
				supported: true, 
				reason: 'MetaMask disponible y conectado',
				address: accounts[0]
			};

		} catch (error) {
			return { 
				supported: false, 
				reason: `Error verificando MetaMask: ${error.message}` 
			};
		}
	}
}

/**
 * Legacy method names for backward compatibility
 * @deprecated Use the main class methods instead
 */
export const encryptForMetaMask = (message, publicKey) => {
	console.warn('⚠️  encryptForMetaMask is deprecated. Use EIP5630Crypto.encrypt instead');
	return EIP5630Crypto.encrypt(message, publicKey);
};

export const decryptWithMetaMask = (encryptedData, signer) => {
	console.warn('⚠️  decryptWithMetaMask is deprecated. Use EIP5630Crypto.decrypt instead');
	return EIP5630Crypto.decrypt(encryptedData, signer);
};

console.log('🚀 EIP5630Crypto module loaded - MetaMask Native Implementation');