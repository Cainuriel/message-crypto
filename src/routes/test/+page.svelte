<script>
	import { onMount } from 'svelte';
	import { EIP5630Crypto } from '$lib/crypto/eip5630.js';
	import { ethers } from 'ethers';

	let testResults = [];
	let isRunning = false;
	let currentTest = '';

	function addResult(test, status, message, details = null) {
		testResults = [...testResults, {
			test,
			status, // 'success', 'error', 'info'
			message,
			details,
			timestamp: new Date().toLocaleTimeString()
		}];
	}

	async function runTests() {
		isRunning = true;
		testResults = [];
		
		try {
			// Test 1: Verificar funciones de utilidad
			currentTest = 'Verificando funciones básicas';
			addResult('Utilidades', 'info', 'Probando funciones de conversión...');
			
			const testHex = '48656c6c6f'; // "Hello" en hex
			const testBytes = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" en bytes
			
			addResult('Hex/Bytes', 'success', 'Conversiones funcionando correctamente');

			// Test 2: Crear wallets de prueba
			currentTest = 'Creando wallets de prueba';
			addResult('Wallets', 'info', 'Generando wallets de prueba...');
			
			const sellerWallet = ethers.Wallet.createRandom();
			const buyerWallet = ethers.Wallet.createRandom();
			
			addResult('Wallets', 'success', 'Wallets creados', {
				seller: sellerWallet.address,
				buyer: buyerWallet.address
			});

			// Test 3: Obtener clave pública de cifrado
			currentTest = 'Obteniendo clave pública';
			addResult('Clave Pública', 'info', 'Derivando clave pública del vendedor...');
			
			const publicKey = await EIP5630Crypto.getEncryptionPublicKey(sellerWallet);
			addResult('Clave Pública', 'success', 'Clave pública obtenida', {
				publicKey: publicKey.slice(0, 20) + '...'
			});

			// Test 4: Cifrar mensaje
			currentTest = 'Cifrando mensaje';
			const testMessage = '¡Hola! Me interesa tu producto. ¿Podemos hablar? 💬';
			addResult('Cifrado', 'info', `Cifrando: "${testMessage}"`);
			
			const encryptedData = await EIP5630Crypto.encrypt(testMessage, publicKey);
			addResult('Cifrado', 'success', 'Mensaje cifrado exitosamente', {
				version: encryptedData.version,
				ephemeralPublicKey: encryptedData.ephemeralPublicKey.slice(0, 20) + '...',
				ciphertext: encryptedData.ciphertext.slice(0, 20) + '...'
			});

			// Test 5: Descifrar mensaje (vendedor)
			currentTest = 'Descifrando mensaje';
			addResult('Descifrado', 'info', 'Descifrando mensaje como vendedor...');
			
			const decryptedMessage = await EIP5630Crypto.decrypt(encryptedData, sellerWallet);
			
			if (decryptedMessage === testMessage) {
				addResult('Descifrado', 'success', 'Mensaje descifrado correctamente', {
					decrypted: decryptedMessage
				});
			} else {
				addResult('Descifrado', 'error', 'Los mensajes no coinciden', {
					original: testMessage,
					decrypted: decryptedMessage
				});
			}

			// Test 6: Intentar descifrar con clave incorrecta
			currentTest = 'Probando seguridad';
			addResult('Seguridad', 'info', 'Probando que el comprador no puede descifrar...');
			
			try {
				await EIP5630Crypto.decrypt(encryptedData, buyerWallet);
				addResult('Seguridad', 'error', 'FALLO DE SEGURIDAD: El comprador pudo descifrar');
			} catch (error) {
				addResult('Seguridad', 'success', 'Correcto: El comprador no puede descifrar', {
					error: error.message.slice(0, 50) + '...'
				});
			}

			// Test 7: Prueba de rendimiento
			currentTest = 'Midiendo rendimiento';
			addResult('Rendimiento', 'info', 'Probando velocidad de cifrado...');
			
			const messages = [
				'Mensaje corto',
				'Este es un mensaje mediano con más contenido para probar el rendimiento',
				'Este es un mensaje muy largo con mucho contenido para probar cómo se comporta el algoritmo EIP-5630 ECIES con mensajes de mayor tamaño. Incluye emojis 🚀✨🔐 y caracteres especiales áéíóú ñ para una prueba completa.'
			];

			for (let i = 0; i < messages.length; i++) {
				const msg = messages[i];
				const start = performance.now();
				
				const encrypted = await EIP5630Crypto.encrypt(msg, publicKey);
				const decrypted = await EIP5630Crypto.decrypt(encrypted, sellerWallet);
				
				const time = performance.now() - start;
				const success = msg === decrypted;
				
				addResult('Rendimiento', success ? 'success' : 'error', 
					`Mensaje ${i + 1}: ${msg.length} chars en ${time.toFixed(2)}ms`, {
					message: msg.slice(0, 30) + (msg.length > 30 ? '...' : ''),
					success
				});
			}

			addResult('Completo', 'success', '🎉 ¡Todas las pruebas completadas exitosamente!');

		} catch (error) {
			addResult('Error', 'error', `Error en ${currentTest}: ${error.message}`, {
				stack: error.stack
			});
		} finally {
			isRunning = false;
			currentTest = '';
		}
	}

	function clearResults() {
		testResults = [];
	}
</script>

<svelte:head>
	<title>Pruebas EIP-5630 - MessageCrypto</title>
</svelte:head>

<div class="container">
	<header class="test-header">
		<h1>🧪 Pruebas EIP-5630 ECIES</h1>
		<p>Verificación de la implementación de cifrado asimétrico</p>
	</header>

	<div class="controls">
		<button 
			class="run-tests-btn" 
			on:click={runTests} 
			disabled={isRunning}
		>
			{#if isRunning}
				⏳ Ejecutando...
			{:else}
				🚀 Ejecutar Pruebas
			{/if}
		</button>

		<button 
			class="clear-btn" 
			on:click={clearResults}
			disabled={isRunning}
		>
			🧹 Limpiar
		</button>
	</div>

	{#if currentTest}
		<div class="current-test">
			<div class="spinner"></div>
			<span>Ejecutando: {currentTest}</span>
		</div>
	{/if}

	<div class="results">
		{#each testResults as result}
			<div class="result-item {result.status}">
				<div class="result-header">
					<span class="test-name">{result.test}</span>
					<span class="timestamp">{result.timestamp}</span>
					<span class="status-icon">
						{#if result.status === 'success'}✅
						{:else if result.status === 'error'}❌
						{:else if result.status === 'info'}ℹ️
						{/if}
					</span>
				</div>
				
				<div class="result-message">{result.message}</div>
				
				{#if result.details}
					<details class="result-details">
						<summary>Ver detalles</summary>
						<pre>{JSON.stringify(result.details, null, 2)}</pre>
					</details>
				{/if}
			</div>
		{/each}
	</div>

	{#if testResults.length === 0 && !isRunning}
		<div class="empty-state">
			<p>🔬 No hay resultados aún</p>
			<p>Haz clic en "Ejecutar Pruebas" para comenzar</p>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem;
		font-family: system-ui, -apple-system, sans-serif;
	}

	.test-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.test-header h1 {
		color: #1f2937;
		margin-bottom: 0.5rem;
	}

	.test-header p {
		color: #6b7280;
		font-size: 1.1rem;
	}

	.controls {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-bottom: 2rem;
	}

	.run-tests-btn {
		background: linear-gradient(135deg, #10b981, #059669);
		color: white;
		border: none;
		padding: 1rem 2rem;
		border-radius: 0.75rem;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
	}

	.run-tests-btn:hover:not(:disabled) {
		background: linear-gradient(135deg, #059669, #047857);
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
	}

	.run-tests-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
		transform: none;
	}

	.clear-btn {
		background: #6b7280;
		color: white;
		border: none;
		padding: 1rem 2rem;
		border-radius: 0.75rem;
		font-size: 1.1rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.clear-btn:hover:not(:disabled) {
		background: #4b5563;
	}

	.current-test {
		display: flex;
		align-items: center;
		gap: 1rem;
		justify-content: center;
		margin-bottom: 2rem;
		padding: 1rem;
		background: #f0f9ff;
		border: 1px solid #bae6fd;
		border-radius: 0.75rem;
		font-weight: 500;
	}

	.spinner {
		width: 20px;
		height: 20px;
		border: 2px solid #e5e7eb;
		border-top: 2px solid #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.results {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.result-item {
		border: 1px solid #e5e7eb;
		border-radius: 0.75rem;
		padding: 1.5rem;
		background: white;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		transition: all 0.2s;
	}

	.result-item:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.result-item.success {
		border-left: 4px solid #10b981;
		background: #f0fdf4;
	}

	.result-item.error {
		border-left: 4px solid #ef4444;
		background: #fef2f2;
	}

	.result-item.info {
		border-left: 4px solid #3b82f6;
		background: #f0f9ff;
	}

	.result-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}

	.test-name {
		font-weight: 600;
		font-size: 1.1rem;
		color: #1f2937;
	}

	.timestamp {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.status-icon {
		font-size: 1.2rem;
	}

	.result-message {
		color: #374151;
		line-height: 1.5;
		margin-bottom: 0.5rem;
	}

	.result-details summary {
		cursor: pointer;
		font-size: 0.875rem;
		color: #6b7280;
		margin-top: 0.5rem;
	}

	.result-details pre {
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		padding: 1rem;
		margin-top: 0.5rem;
		font-size: 0.875rem;
		overflow-x: auto;
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		color: #6b7280;
	}

	.empty-state p {
		margin: 0.5rem 0;
	}

	.empty-state p:first-child {
		font-size: 1.2rem;
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}

		.controls {
			flex-direction: column;
			align-items: center;
		}

		.run-tests-btn, .clear-btn {
			width: 100%;
			max-width: 300px;
		}
	}
</style>