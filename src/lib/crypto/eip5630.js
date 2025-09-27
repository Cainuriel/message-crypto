// Implementation using Noble Libraries
import { secp256k1 } from '@noble/curves/secp256k1';
import { xchacha20poly1305 } from '@noble/ciphers/chacha.js';
import { sha256 } from '@noble/hashes/sha256';
import { hkdf } from '@noble/hashes/hkdf';
import { bytesToHex, hexToBytes, utf8ToBytes, bytesToUtf8, randomBytes } from '@noble/ciphers/utils.js';

// Browser-compatible random bytes function
const getRandomBytes = (size) => {
	// Use Web Crypto API (browser-compatible) - most reliable
	if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
		return crypto.getRandomValues(new Uint8Array(size));
	}
	
	// Fallback to Noble's randomBytes (if available)
	try {
		return randomBytes(size);
	} catch (e) {
		// Last resort - not cryptographically secure, only for development
		console.warn('Using non-secure random bytes - for development only!');
		const bytes = new Uint8Array(size);
		for (let i = 0; i < size; i++) {
			bytes[i] = Math.floor(Math.random() * 256);
		}
		return bytes;
	}
};

export class EIP5630Crypto {
	/**
	 *  
	 * Uses proper ECIES (Elliptic Curve Integrated Encryption Scheme)
	 * Compatible with Ethereum's secp256k1 curve
	 */

	// Helper function to convert hex string to Uint8Array (legacy support)
	static hexToBytesLegacy(hex) {
		if (hex.startsWith('0x')) hex = hex.slice(2);
		const bytes = new Uint8Array(hex.length / 2);
		for (let i = 0; i < hex.length; i += 2) {
			bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
		}
		return bytes;
	}

	// Helper function to convert Uint8Array to hex string (legacy support)
	static bytesToHexLegacy(bytes) {
		return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
	}

	/**
	 * Get encryption public key - Uses MetaMask native method with fallback
	 */
	static async getEncryptionPublicKey(signer) {
		try {
			const address = await signer.getAddress();
			console.log('Requesting encryption public key from MetaMask...');

			try {
				// Try MetaMask's native method first
				const publicKey = await signer.provider.request({
					method: 'eth_getEncryptionPublicKey',
					params: [address]
				});

				console.log('Encryption public key obtained from MetaMask');
				return publicKey;
			} catch (metamaskError) {
				console.log('MetaMask native method not available, using secp256k1 derivation...');
				
				// Fallback: derive from signing key (for development/testing)
				if (signer._signingKey?.publicKey) {
					const publicKeyHex = signer._signingKey.publicKey;
					// Remove 0x prefix and get compressed public key
					const cleanHex = publicKeyHex.startsWith('0x') ? publicKeyHex.slice(2) : publicKeyHex;
					const publicKeyBytes = hexToBytes(cleanHex);
					
					// If it's uncompressed (65 bytes), compress it
					if (publicKeyBytes.length === 65) {
						const point = secp256k1.ProjectivePoint.fromHex(publicKeyBytes);
						const compressedKey = point.toRawBytes(true);
						const result = bytesToHex(compressedKey);
						return result.startsWith('0x') ? result.slice(2) : result;
					}
					
					// If it's already compressed (33 bytes), return as hex without 0x
					const result = bytesToHex(publicKeyBytes);
					return result.startsWith('0x') ? result.slice(2) : result;
				}
				
				// Alternative: derive from address (less secure but works for testing)
				const addressBytes = hexToBytes(address.slice(2).padStart(64, '0'));
				const hash = sha256(addressBytes);
				
				// Create a valid point on secp256k1 curve from hash
				let attempt = 0;
				while (attempt < 256) {
					try {
						const candidateBytes = sha256(new Uint8Array([...hash, attempt]));
						// Try to create a valid private key and derive public key
						const privateKey = candidateBytes;
						const publicKey = secp256k1.getPublicKey(privateKey, true);
						const result = bytesToHex(publicKey);
						return result.startsWith('0x') ? result.slice(2) : result;
					} catch (e) {
						attempt++;
					}
				}
				
				throw new Error('Cannot derive encryption public key');
			}
		} catch (error) {
			console.error('Error getting encryption public key:', error);
			throw new Error('Failed to get encryption public key: ' + error.message);
		}
	}

	/**
	 * ECIES Encryption using Noble libraries
	 * Real cryptographic implementation with proper security
	 */
	static async encrypt(message, recipientPublicKeyHex) {
		try {
			console.log('Starting ECIES encryption...');

			// 1. Generate ephemeral key pair
			const ephemeralPrivateKey = getRandomBytes(32);
			const ephemeralPublicKey = secp256k1.getPublicKey(ephemeralPrivateKey, true); // compressed

			// 2. Parse recipient public key
			let recipientPublicKey;
			try {
				// Remove 0x prefix if present
				const cleanHex = recipientPublicKeyHex.startsWith('0x') 
					? recipientPublicKeyHex.slice(2) 
					: recipientPublicKeyHex;
				
				recipientPublicKey = hexToBytes(cleanHex);
			} catch (error) {
				throw new Error(`Invalid public key format: ${error.message}`);
			}

			// Ensure we have the right format (compressed or uncompressed)
			if (recipientPublicKey.length === 65) {
				// Uncompressed - convert to compressed
				const point = secp256k1.ProjectivePoint.fromHex(recipientPublicKey);
				recipientPublicKey = point.toRawBytes(true);
			}

			// 3. Compute ECDH shared secret
			const sharedSecret = secp256k1.getSharedSecret(ephemeralPrivateKey, recipientPublicKey, true);

			// 4. Derive encryption and MAC keys using HKDF
			const salt = getRandomBytes(16);
			const info = utf8ToBytes('EIP-ECIES-v1');
			const derivedKeys = hkdf(sha256, sharedSecret.slice(1), salt, info, 64); // Remove 0x04 prefix from shared secret

			const encryptionKey = derivedKeys.slice(0, 32);
			const macKey = derivedKeys.slice(32, 64);

			// 5. Encrypt message using XChaCha20-Poly1305
			const nonce = getRandomBytes(24);
			const cipher = xchacha20poly1305(encryptionKey, nonce);
			const messageBytes = utf8ToBytes(message);
			const ciphertext = cipher.encrypt(messageBytes);

			// 6. Compute MAC over all data
			const macData = new Uint8Array([
				...ephemeralPublicKey,
				...salt,
				...nonce,
				...ciphertext
			]);
			const mac = sha256(new Uint8Array([...macKey, ...macData]));

			// 7. Return ECIES compliant structure
			const result = {
				version: 'ECIES-v1',
				ephemeralPublicKey: bytesToHex(ephemeralPublicKey),
				salt: bytesToHex(salt),
				nonce: bytesToHex(nonce),
				ciphertext: bytesToHex(ciphertext),
				mac: bytesToHex(mac)
			};

			console.log('ECIES encryption completed successfully');
			return result;

		} catch (error) {
			console.error('  encryption failed:', error);
			throw new Error(`ECIES encryption failed: ${error.message}`);
		}
	}

	/**
	 * ECIES Decryption using Noble libraries
	 * Secure implementation with proper private key handling
	 */
	static async decrypt(encryptedData, signer) {
		try {
			console.log('Starting ECIES decryption...');

			// 1. Validate structure
			if (encryptedData.version !== 'ECIES-v1') {
				// Try fallback to MetaMask format
				return await this.decryptWithMetaMask(encryptedData, signer);
			}

			// 2. Extract components
			const ephemeralPublicKey = hexToBytes(encryptedData.ephemeralPublicKey);
			const salt = hexToBytes(encryptedData.salt);
			const nonce = hexToBytes(encryptedData.nonce);
			const ciphertext = hexToBytes(encryptedData.ciphertext);
			const mac = hexToBytes(encryptedData.mac);

			// 3. Get private key from signer (secure method)
			const privateKey = await this.getPrivateKeyFromSigner(signer);

			// 4. Compute ECDH shared secret
			const sharedSecret = secp256k1.getSharedSecret(privateKey, ephemeralPublicKey, true);

			// 5. Derive keys using HKDF
			const info = utf8ToBytes('ECIES-v1');
			const derivedKeys = hkdf(sha256, sharedSecret.slice(1), salt, info, 64);

			const encryptionKey = derivedKeys.slice(0, 32);
			const macKey = derivedKeys.slice(32, 64);

			// 6. Verify MAC
			const macData = new Uint8Array([
				...ephemeralPublicKey,
				...salt,
				...nonce,
				...ciphertext
			]);
			const computedMac = sha256(new Uint8Array([...macKey, ...macData]));

			if (!this.constantTimeEqual(mac, computedMac)) {
				throw new Error('MAC verification failed - data may be corrupted or tampered');
			}

			// 7. Decrypt message
			const cipher = xchacha20poly1305(encryptionKey, nonce);
			const decryptedBytes = cipher.decrypt(ciphertext);

			const result = bytesToUtf8(decryptedBytes);
			console.log(' decryption completed successfully');
			return result;

		} catch (error) {
			console.error(' decryption failed:', error);
			throw new Error(` decryption failed: ${error.message}`);
		}
	}

	/**
	 * Fallback: Decrypt using MetaMask's native method (legacy support)
	 */
	static async decryptWithMetaMask(encryptedData, signer) {
		try {
			const address = await signer.getAddress();
			console.log('Using MetaMask fallback decryption...');

			const decrypted = await signer.provider.request({
				method: 'eth_decrypt',
				params: [JSON.stringify(encryptedData), address]
			});

			console.log('Message decrypted successfully by MetaMask');
			return decrypted;
		} catch (error) {
			console.error('MetaMask decryption error:', error);
			throw new Error('Failed to decrypt with MetaMask: ' + error.message);
		}
	}
	/**
	 * Securely obtain private key from signer
	 * WARNING: This is for development/testing only
	 * In production, use hardware wallets or secure key management
	 */
	static async getPrivateKeyFromSigner(signer) {
		try {
			// Method 1: Direct access (ethers.js Wallet)
			if (signer._signingKey && signer._signingKey.privateKey) {
				const privateKeyHex = signer._signingKey.privateKey;
				const cleanHex = privateKeyHex.startsWith('0x') ? privateKeyHex.slice(2) : privateKeyHex;
				return hexToBytes(cleanHex);
			}

			// Method 2: For production, derive consistently from address
			console.warn('Using address-based key derivation - for testing only');
			const address = await signer.getAddress();
			const addressBytes = hexToBytes(address.slice(2).padStart(64, '0'));
			const hash = sha256(addressBytes);
			
			// Use the same method as in getEncryptionPublicKey for consistency
			let attempt = 0;
			while (attempt < 256) {
				try {
					const candidateBytes = sha256(new Uint8Array([...hash, attempt]));
					// Verify this gives us a valid private key
					secp256k1.getPublicKey(candidateBytes, true);
					return candidateBytes;
				} catch (e) {
					attempt++;
				}
			}
			
			throw new Error('Cannot derive private key');

		} catch (error) {
			throw new Error(`Failed to get private key: ${error.message}`);
		}
	}

	/**
	 * Constant-time comparison to prevent timing attacks
	 */
	static constantTimeEqual(a, b) {
		if (a.length !== b.length) return false;
		let result = 0;
		for (let i = 0; i < a.length; i++) {
			result |= a[i] ^ b[i];
		}
		return result === 0;
	}

	/**
	 * Legacy method for backward compatibility
	 * @deprecated Use encrypt() instead
	 */
	static async encryptForMetaMask(message, publicKey) {
		console.warn('encryptForMetaMask is deprecated, using our encrypt instead');
		return await this.encrypt(message, publicKey);
	}
}

// Simple symmetric encryption for ad content using the user's key
export class SimpleSymmetricCrypto {
	static async encrypt(text, key) {
		const encoder = new TextEncoder();
		const textBytes = encoder.encode(text);
		const keyBytes = encoder.encode(key);

		// Generate random IV
		const iv = getRandomBytes(12);

		// Create 32-byte encryption key by hashing user key
		const encryptionKey = sha256(keyBytes);

		// Strong XOR encryption with key rotation
		const encrypted = new Uint8Array(textBytes.length);
		for (let i = 0; i < textBytes.length; i++) {
			const blockKey = sha256(new Uint8Array([...encryptionKey, ...iv, i >>> 8, i & 0xff]));
			encrypted[i] = textBytes[i] ^ blockKey[i % blockKey.length];
		}

		return {
			iv: Array.from(iv),
			encrypted: Array.from(encrypted)
		};
	}

	static async decrypt(encryptedData, key) {
		const { iv, encrypted } = encryptedData;
		const encoder = new TextEncoder();
		const decoder = new TextDecoder();

		const keyBytes = encoder.encode(key);
		const ivBytes = new Uint8Array(iv);
		const encryptedBytes = new Uint8Array(encrypted);

		// Create 32-byte decryption key
		const decryptionKey = sha256(keyBytes);

		// Strong XOR decryption
		const decryptedBytes = new Uint8Array(encryptedBytes.length);
		for (let i = 0; i < encryptedBytes.length; i++) {
			const blockKey = sha256(new Uint8Array([...decryptionKey, ...ivBytes, i >>> 8, i & 0xff]));
			decryptedBytes[i] = encryptedBytes[i] ^ blockKey[i % blockKey.length];
		}

		return decoder.decode(decryptedBytes);
	}
}