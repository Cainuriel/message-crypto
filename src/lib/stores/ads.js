import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const ads = writable([]);
export const messages = writable({});

// Función para cargar datos del localStorage
function loadFromStorage() {
	if (!browser) return { ads: [], messages: {} };
	
	try {
		const storedAds = localStorage.getItem('messageCrypto_ads');
		const storedMessages = localStorage.getItem('messageCrypto_messages');
		
		return {
			ads: storedAds ? JSON.parse(storedAds) : [],
			messages: storedMessages ? JSON.parse(storedMessages) : {}
		};
	} catch (error) {
		console.error('Error loading from localStorage:', error);
		return { ads: [], messages: {} };
	}
}

// Función para guardar datos en localStorage
function saveToStorage() {
	if (!browser) return;
	
	try {
		localStorage.setItem('messageCrypto_ads', JSON.stringify(adsStorage));
		localStorage.setItem('messageCrypto_messages', JSON.stringify(messagesStorage));
	} catch (error) {
		console.error('Error saving to localStorage:', error);
	}
}

// Cargar datos iniciales
const initialData = loadFromStorage();
let adsStorage = initialData.ads;
let messagesStorage = initialData.messages;

// Actualizar stores con datos cargados
if (browser) {
	ads.set(adsStorage);
	messages.set(messagesStorage);
}

/**
 * Crear un nuevo anuncio con clave pública de encriptación
 */
export const createAd = async (adData, imageFile, userAddress, signer) => {
	try {
		console.log('Creando anuncio con encriptación...');
		
		// 1. Generar clave pública de encriptación usando nuestra API
		console.log('Generando clave pública de encriptación...');
		const message = `ENCRYPTION_KEY_FOR_ADS_${userAddress}`;
		const signature = await signer.signMessage(message);
		
		const keyResponse = await fetch('/api/encryption/generate-key-test', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ address: userAddress, signature })
		});
		
		const keyResult = await keyResponse.json();
		
		if (!keyResult.success) {
			throw new Error(`Error generando clave: ${keyResult.error}`);
		}
		
		console.log('Clave pública generada:', keyResult.publicKey);
		
		// 2. Simular subida de imagen
		const imageUrl = URL.createObjectURL(imageFile);
		
		// 3. Crear el anuncio
		const newAd = {
			id: Date.now().toString(),
			title: adData.title,
			description: adData.description,
			price: adData.price,
			imageUrl,
			creator: userAddress,
			publicKey: keyResult.publicKey, // Clave pública para encriptación
			derivedAddress: keyResult.derivedAddress, // Dirección derivada
			keyId: keyResult.keyId, // ID de la clave
			createdAt: new Date().toISOString(),
			messageCount: 0
		};
		
		// 4. Guardar en storage
		adsStorage.push(newAd);
		ads.set([...adsStorage]);
		saveToStorage(); // Guardar en localStorage
		
		console.log('Anuncio creado exitosamente:', newAd.id);
		
		return { success: true, ad: newAd };
	} catch (error) {
		console.error('Error creating ad:', error);
		return { success: false, error: error.message };
	}
};

/**
 * Obtener todos los anuncios
 */
export const getAds = () => {
	ads.set([...adsStorage]);
	return adsStorage;
};

/**
 * Obtener un anuncio por ID
 */
export const getAdById = (adId) => {
	return adsStorage.find(ad => ad.id === adId);
};

/**
 * Enviar mensaje encriptado a un anuncio
 */
export const sendMessage = async (adId, messageText, senderAddress) => {
	try {
		console.log(`Enviando mensaje encriptado al anuncio ${adId}...`);
		
		// 1. Obtener el anuncio
		const ad = adsStorage.find(a => a.id === adId);
		if (!ad) {
			throw new Error('Anuncio no encontrado');
		}
		
		console.log('Anuncio encontrado, clave pública:', ad.publicKey);
		
		// 2. Encriptar mensaje usando la clave pública del anuncio
		const encryptResponse = await fetch('/api/encryption/encrypt-simple', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				message: messageText,
				recipientPublicKey: ad.publicKey
			})
		});
		
		const encryptResult = await encryptResponse.json();
		
		if (!encryptResult.success) {
			throw new Error(`Error encriptando mensaje: ${encryptResult.error}`);
		}
		
		console.log('Mensaje encriptado exitosamente');
		
		// 3. Crear objeto de mensaje
		const newMessage = {
			id: Date.now().toString(),
			adId: adId,
			sender: senderAddress,
			encryptedData: encryptResult.encryptedData,
			timestamp: new Date().toISOString(),
			decrypted: false
		};
		
		// 4. Guardar mensaje
		if (!messagesStorage[adId]) {
			messagesStorage[adId] = [];
		}
		messagesStorage[adId].push(newMessage);
		
		// 5. Actualizar contador en el anuncio
		ad.messageCount = (ad.messageCount || 0) + 1;
		ads.set([...adsStorage]);
		
		// 6. Actualizar store de mensajes
		messages.set({...messagesStorage});
		
		// 7. Guardar en localStorage
		saveToStorage();
		
		console.log('Mensaje guardado exitosamente');
		
		return { success: true, message: newMessage };
	} catch (error) {
		console.error('Error sending message:', error);
		return { success: false, error: error.message };
	}
};

/**
 * Obtener mensajes de un anuncio
 */
export const getMessagesForAd = (adId) => {
	const adMessages = messagesStorage[adId] || [];
	console.log('Getting messages for ad:', adId);
	console.log('messagesStorage keys:', Object.keys(messagesStorage));
	console.log('Found messages:', adMessages.length);
	
	// Convertir estructura de datos para compatibilidad con la interfaz
	return adMessages.map(msg => ({
		id: msg.id,
		sender: msg.sender,
		encryptedContent: msg.encryptedData,
		sentAt: msg.timestamp,
		decryptedContent: msg.decryptedText || null
	}));
};

/**
 * Descifrar mensaje usando MetaMask
 */
export const decryptMessage = async (messageId, userAddress, signer) => {
	try {
		console.log(`Descifrando mensaje ${messageId}...`);
		
		// 1. Encontrar el mensaje y el anuncio correspondiente
		let message = null;
		let adId = null;
		let targetAd = null;
		
		for (const [currentAdId, adMessages] of Object.entries(messagesStorage)) {
			const foundMessage = adMessages.find(m => m.id === messageId);
			if (foundMessage) {
				message = foundMessage;
				adId = currentAdId;
				// Encontrar el anuncio correspondiente
				targetAd = adsStorage.find(ad => ad.id === currentAdId);
				break;
			}
		}
		
		if (!message) {
			throw new Error('Mensaje no encontrado');
		}
		
		if (!targetAd) {
			throw new Error('Anuncio no encontrado');
		}
		
		if (message.decryptedText) {
			return { success: true, decryptedMessage: message.decryptedText };
		}
		
		console.log('Mensaje encontrado, descifrando...');
		console.log('userAddress:', userAddress);
		console.log('targetAd.creator:', targetAd.creator);
		console.log('targetAd.derivedAddress:', targetAd.derivedAddress);
		console.log('message.encryptedData:', message.encryptedData);
		console.log('adsStorage length:', adsStorage.length);
		console.log('All ads:', adsStorage.map(ad => ({ id: ad.id, creator: ad.creator, derivedAddress: ad.derivedAddress })));
		
		// Verificar que el usuario es el dueño del anuncio
		if (targetAd.creator !== userAddress) {
			console.error('ACCESS DENIED:');
			console.error('- targetAd.creator:', targetAd.creator);
			console.error('- userAddress:', userAddress);
			console.error('- Are equal?', targetAd.creator === userAddress);
			console.error('- targetAd.creator type:', typeof targetAd.creator);
			console.error('- userAddress type:', typeof userAddress);
			throw new Error('Solo el creador del anuncio puede descifrar los mensajes');
		}
		
		// 2. Firmar para obtener clave de descifrado
		const signatureMessage = `ENCRYPTION_KEY_FOR_ADS_${userAddress}`;
		const signature = await signer.signMessage(signatureMessage);
		
		console.log('signature:', signature);
		
		// 3. Descifrar usando nuestra API - USAR LA DIRECCIÓN ORIGINAL, NO LA DERIVADA
		const decryptRequest = {
			encryptedData: message.encryptedData,
			address: userAddress, // ← Cambio: usar userAddress (dirección original)
			signature: signature
		};
		
		console.log('Sending decrypt request:', decryptRequest);
		console.log('Using userAddress (original):', userAddress);
		console.log('NOT using derivedAddress:', targetAd.derivedAddress);
		
		const decryptResponse = await fetch('/api/encryption/decrypt-simple', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(decryptRequest)
		});
		
		const decryptResult = await decryptResponse.json();
		
		if (!decryptResult.success) {
			throw new Error(`Error descifrando mensaje: ${decryptResult.error}`);
		}
		
		console.log('Mensaje descifrado exitosamente');
		
		// 4. Guardar texto descifrado en el mensaje
		message.decryptedText = decryptResult.message;
		message.decrypted = true;
		
		// 5. Actualizar store
		messages.set({...messagesStorage});
		
		// 6. Guardar en localStorage
		saveToStorage();
		
		return { success: true, decryptedMessage: decryptResult.message };
	} catch (error) {
		console.error('Error decrypting message:', error);
		return { success: false, error: error.message };
	}
};

/**
 * Limpiar todos los datos (útil para debugging)
 */
export const clearAllData = () => {
	if (!browser) return;
	
	adsStorage = [];
	messagesStorage = {};
	
	ads.set([]);
	messages.set({});
	
	localStorage.removeItem('messageCrypto_ads');
	localStorage.removeItem('messageCrypto_messages');
	
	console.log('Todos los datos han sido limpiados');
};

/**
 * Limpiar storage (para testing)
 */
export const clearStorage = () => {
	adsStorage = [];
	messagesStorage = {};
	ads.set([]);
	messages.set({});
};