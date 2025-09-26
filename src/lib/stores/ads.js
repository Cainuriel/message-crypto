import { writable } from 'svelte/store';
import { EIP5630Crypto, SimpleSymmetricCrypto } from '$lib/crypto/eip5630.js';

export const ads = writable([]);
export const messages = writable({});

// Mock storage - en producción usarías una base de datos
let adsStorage = [];
let messagesStorage = {};

export const createAd = async (adData, imageFile, signer) => {
	try {
		// Simular subida de imagen
		const imageUrl = URL.createObjectURL(imageFile);

		// Obtener la clave pública de cifrado de MetaMask (método seguro)
		console.log('Obteniendo clave pública de cifrado de MetaMask...');
		const encryptionPublicKey = await EIP5630Crypto.getEncryptionPublicKey(signer);
		console.log('Clave pública de cifrado obtenida exitosamente');

		const newAd = {
			id: Date.now().toString(),
			title: adData.title,
			description: adData.description,
			price: adData.price,
			imageUrl,
			creator: adData.creator,
			encryptionPublicKey: encryptionPublicKey, // Clave pública de cifrado de MetaMask
			createdAt: new Date().toISOString(),
			messages: []
		};

		adsStorage.push(newAd);
		ads.set([...adsStorage]);

		return { success: true, ad: newAd };
	} catch (error) {
		console.error('Error creating ad:', error);
		return { success: false, error: error.message };
	}
};

export const getAds = () => {
	ads.set([...adsStorage]);
	return adsStorage;
};

export const sendMessage = async (adId, messageText, senderAddress) => {
	try {
		const ad = adsStorage.find(a => a.id === adId);
		if (!ad) {
			throw new Error('Anuncio no encontrado');
		}

		if (!ad.encryptionPublicKey) {
			throw new Error('Clave pública de cifrado del vendedor no disponible');
		}

		console.log('Cifrando mensaje con EIP-5630 ECIES...');

		// Usar la implementación mejorada de EIP-5630 con ECIES real
		const encryptedMessage = await EIP5630Crypto.encrypt(
			messageText, 
			ad.encryptionPublicKey
		);

		console.log('Mensaje cifrado exitosamente con EIP-5630');

		const message = {
			id: Date.now().toString(),
			adId,
			encryptedContent: encryptedMessage,
			sender: senderAddress,
			timestamp: new Date().toISOString()
		};

		// Guardar mensaje
		if (!messagesStorage[adId]) {
			messagesStorage[adId] = [];
		}
		messagesStorage[adId].push(message);

		// Actualizar el anuncio
		ad.messages.push(message.id);

		messages.set({ ...messagesStorage });
		ads.set([...adsStorage]);

		return { success: true, message };
	} catch (error) {
		console.error('Error sending encrypted message:', error);
		return { success: false, error: error.message };
	}
};

export const getMessagesForAd = (adId) => {
	return messagesStorage[adId] || [];
};

export const decryptMessage = async (messageId, adId, signer) => {
	try {
		const adMessages = messagesStorage[adId] || [];
		const message = adMessages.find(m => m.id === messageId);

		if (!message) {
			throw new Error('Mensaje no encontrado');
		}

		console.log('Descifrando mensaje con EIP-5630 ECIES...');

		// Usar la implementación mejorada de EIP-5630 con fallback a MetaMask
		const decryptedText = await EIP5630Crypto.decrypt(
			message.encryptedContent,
			signer
		);

		console.log('Mensaje descifrado exitosamente con EIP-5630');
		return { success: true, decryptedText };
	} catch (error) {
		console.error('Error decrypting message:', error);
		return { success: false, error: error.message };
	}
};