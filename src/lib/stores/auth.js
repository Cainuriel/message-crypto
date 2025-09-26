import { writable } from 'svelte/store';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

export const isConnected = writable(false);
export const userAddress = writable('');
export const provider = writable(null);
export const signer = writable(null);

export const connectWallet = async (inputAddress = '') => {
	try {
		// Verificar que window.ethereum existe
		if (typeof window === 'undefined' || !window.ethereum) {
			throw new Error('MetaMask no está instalada o no está disponible');
		}

		const ethereumProvider = await detectEthereumProvider();

		if (!ethereumProvider) {
			throw new Error('MetaMask no fue detectada');
		}

		// Verificar que MetaMask está desbloqueada
		const accounts = await ethereumProvider.request({ method: 'eth_accounts' });

		// Si no hay cuentas, solicitar conexión
		if (accounts.length === 0) {
			await ethereumProvider.request({ method: 'eth_requestAccounts' });
		}

		const web3Provider = new ethers.BrowserProvider(ethereumProvider);
		const walletSigner = await web3Provider.getSigner();
		const walletAddress = await walletSigner.getAddress();

		console.log('Dirección detectada:', walletAddress);
		console.log('Dirección ingresada:', inputAddress);

		if (inputAddress && inputAddress.toLowerCase() !== walletAddress.toLowerCase()) {
			throw new Error(`La dirección de MetaMask (${walletAddress}) no coincide con la proporcionada (${inputAddress})`);
		}

		const message = `Confirma tu identidad para acceder a MessageCrypto.\nDirección: ${walletAddress}\nTimestamp: ${Date.now()}`;

		console.log('Solicitando firma del mensaje...');
		const signature = await walletSigner.signMessage(message);
		console.log('Mensaje firmado exitosamente');

		provider.set(web3Provider);
		signer.set(walletSigner);
		userAddress.set(walletAddress);
		isConnected.set(true);

		return { success: true, address: walletAddress };
	} catch (error) {
		console.error('Error conectando wallet:', error);

		// Manejar diferentes tipos de errores
		let errorMessage = error.message;

		if (error.code === 4001) {
			errorMessage = 'Usuario rechazó la conexión con MetaMask';
		} else if (error.code === -32002) {
			errorMessage = 'Ya hay una solicitud pendiente en MetaMask';
		}

		return { success: false, error: errorMessage };
	}
};

export const disconnect = () => {
	isConnected.set(false);
	userAddress.set('');
	provider.set(null);
	signer.set(null);
};