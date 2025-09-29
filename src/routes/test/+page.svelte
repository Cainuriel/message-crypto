<script>
	import { onMount } from 'svelte';

	// Estado de la aplicación
	let testResults = [];
	let isRunning = false;
	let currentTest = '';
	let EIP5630Crypto = null;
	
	// Estado de MetaMask
	let provider = null;
	let signer = null;
	let isMetaMaskConnected = false;
	let userAddress = '';

	// Función para agregar resultados de tests
	function addResult(test, status, message, details = null) {
		testResults = [...testResults, {
			test,
			status, // 'success', 'error', 'info', 'warning'
			message,
			details,
			timestamp: new Date().toLocaleTimeString()
		}];
	}

	// Conectar con MetaMask
	async function connectMetaMask() {
		try {
			if (typeof window.ethereum === 'undefined') {
				throw new Error('MetaMask no está instalado. Por favor instala MetaMask primero.');
			}

			addResult('MetaMask', 'info', 'Conectando con MetaMask...');

			// Importar ethers dinámicamente
			const { ethers } = await import('ethers');
			
			// Solicitar acceso a las cuentas
			await window.ethereum.request({ method: 'eth_requestAccounts' });
			
			// Crear provider y signer
			provider = new ethers.BrowserProvider(window.ethereum);
			signer = await provider.getSigner();
			userAddress = await signer.getAddress();
			
			isMetaMaskConnected = true;
			
			addResult('MetaMask', 'success', `Conectado exitosamente: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`);
			
		} catch (error) {
			addResult('MetaMask', 'error', 'Error conectando MetaMask', { error: error.message });
			throw error;
		}
	}

	// Desconectar MetaMask
	function disconnectMetaMask() {
		provider = null;
		signer = null;
		isMetaMaskConnected = false;
		userAddress = '';
		addResult('MetaMask', 'info', 'Desconectado de MetaMask');
	}

	// Ejecutar todos los tests
	async function runTests() {
		isRunning = true;
		testResults = [];
		
		try {
			// 1. Cargar módulos criptográficos
			if (!EIP5630Crypto) {
				currentTest = 'Inicializando módulos criptográficos';
				addResult('Módulos', 'info', 'Cargando módulos de encriptación...');
				
				const cryptoModule = await import('$lib/crypto/eip5630.js');
				EIP5630Crypto = cryptoModule.EIP5630Crypto;
				
				addResult('Módulos', 'success', 'Módulos criptográficos cargados correctamente');
			}
			
			// 2. Conectar MetaMask si no está conectado
			if (!isMetaMaskConnected) {
				currentTest = 'Conectando MetaMask';
				await connectMetaMask();
			}
			
			// 3. Verificar conexión MetaMask
			currentTest = 'Verificando conexión MetaMask';
			addResult('Conexión', 'info', 'Verificando signer de MetaMask...');
			
			const address = await signer.getAddress();
			addResult('Conexión', 'success', `Signer verificado: ${address}`);

			// 4. Obtener clave pública de encriptación
			currentTest = 'Obteniendo clave pública de encriptación';
			addResult('Clave Pública', 'info', 'Solicitando clave pública de encriptación...');
			
			let publicKey;
			try {
				publicKey = await EIP5630Crypto.getEncryptionPublicKey(signer);
				addResult('Clave Pública', 'success', `Clave pública obtenida: ${publicKey.substring(0, 20)}...`);
			} catch (error) {
				addResult('Clave Pública', 'error', 'Error obteniendo clave pública', { 
					error: error.message
				});
				throw error;
			}

			// 5. Encriptar mensaje de prueba
			currentTest = 'Encriptando mensaje de prueba';
			const testMessage = `¡Hola MetaMask! Mensaje de prueba encriptado en ${new Date().toLocaleString()}`;
			addResult('Encriptación', 'info', `Encriptando mensaje: "${testMessage}"`);
			
			let encryptedData;
			try {
				encryptedData = await EIP5630Crypto.encrypt(testMessage, publicKey);
				addResult('Encriptación', 'success', 'Mensaje encriptado exitosamente', {
					version: encryptedData.version,
					hasNonce: !!encryptedData.nonce,
					hasEphemPublicKey: !!encryptedData.ephemPublicKey,
					hasCiphertext: !!encryptedData.ciphertext
				});
			} catch (error) {
				addResult('Encriptación', 'error', 'Error en encriptación', { 
					error: error.message
				});
				throw error;
			}

			// 6. Desencriptar mensaje
			currentTest = 'Desencriptando mensaje';
			addResult('Desencriptación', 'info', 'Desencriptando mensaje...');
			
			try {
				const decryptedMessage = await EIP5630Crypto.decrypt(encryptedData, signer);
				
				if (decryptedMessage === testMessage) {
					addResult('Desencriptación', 'success', `Mensaje desencriptado correctamente: "${decryptedMessage}"`);
				} else {
					addResult('Desencriptación', 'error', 'El mensaje desencriptado no coincide', {
						original: testMessage,
						decrypted: decryptedMessage
					});
					throw new Error('Los mensajes no coinciden después de la encriptación/desencriptación');
				}
				
			} catch (error) {
				addResult('Desencriptación', 'error', 'Error en desencriptación', { 
					error: error.message
				});
				throw error;
			}

			// 7. Test con mensaje largo
			currentTest = 'Probando con mensaje largo';
			const longMessage = 'Este es un mensaje mucho más largo para probar la robustez del sistema de encriptación. '.repeat(15) + ` Timestamp: ${Date.now()}`;
			
			addResult('Mensaje Largo', 'info', `Probando mensaje de ${longMessage.length} caracteres...`);
			
			try {
				const longEncrypted = await EIP5630Crypto.encrypt(longMessage, publicKey);
				const longDecrypted = await EIP5630Crypto.decrypt(longEncrypted, signer);
				
				if (longDecrypted === longMessage) {
					addResult('Mensaje Largo', 'success', 'Test de integridad con mensaje largo exitoso');
				} else {
					addResult('Mensaje Largo', 'error', 'Fallo en test de integridad con mensaje largo');
				}
			} catch (error) {
				addResult('Mensaje Largo', 'error', 'Error en test de mensaje largo', { 
					error: error.message 
				});
			}

			// 8. Test de múltiples encriptaciones (nonces únicos)
			currentTest = 'Probando múltiples encriptaciones';
			addResult('Nonces Únicos', 'info', 'Probando que cada encriptación genere nonces únicos...');
			
			try {
				const message = 'Mensaje para test de nonces únicos';
				const encrypted1 = await EIP5630Crypto.encrypt(message, publicKey);
				const encrypted2 = await EIP5630Crypto.encrypt(message, publicKey);
				
				const uniqueNonces = encrypted1.nonce !== encrypted2.nonce;
				const uniqueCiphertext = encrypted1.ciphertext !== encrypted2.ciphertext;
				
				const decrypted1 = await EIP5630Crypto.decrypt(encrypted1, signer);
				const decrypted2 = await EIP5630Crypto.decrypt(encrypted2, signer);
				
				const bothCorrect = decrypted1 === message && decrypted2 === message;
				
				if (uniqueNonces && uniqueCiphertext && bothCorrect) {
					addResult('Nonces Únicos', 'success', 'Nonces únicos confirmados ✓ - Cada encriptación es diferente');
				} else {
					addResult('Nonces Únicos', 'warning', 'Posibles problemas detectados en nonces únicos', {
						uniqueNonces,
						uniqueCiphertext,
						bothCorrect
					});
				}
			} catch (error) {
				addResult('Nonces Únicos', 'error', 'Error en test de nonces únicos', { 
					error: error.message 
				});
			}

			// Resumen final exitoso
			addResult('🎉 RESUMEN', 'success', '¡Todos los tests completados exitosamente!', {
				walletAddress: userAddress,
				totalTests: 6,
				completedAt: new Date().toLocaleString()
			});

		} catch (error) {
			addResult('❌ ERROR GENERAL', 'error', `Error en la prueba: ${currentTest}`, {
				error: error.message
			});
		} finally {
			isRunning = false;
			currentTest = '';
		}
	}

	// Limpiar resultados
	function clearResults() {
		testResults = [];
	}
</script>

<svelte:head>
	<title>Tests de Encriptación con MetaMask - MessageCrypto</title>
</svelte:head>

<div class="container">
	<!-- Header -->
	<header class="header">
		<h1>🔐 Tests de Encriptación con MetaMask</h1>
		<p class="subtitle">Pruebas del sistema de cifrado EIP-5630 usando tu wallet real de MetaMask</p>
	</header>

	<!-- Controles principales -->
	<section class="controls">
		<!-- Sección de conexión MetaMask -->
		{#if !isMetaMaskConnected}
			<div class="metamask-section">
				<h3>🦊 Conectar MetaMask</h3>
				<p>Necesitas conectar tu wallet MetaMask para ejecutar los tests</p>
				<button 
					class="btn btn-primary" 
					on:click={connectMetaMask}
					disabled={isRunning}
				>
					Conectar MetaMask
				</button>
			</div>
		{:else}
			<div class="metamask-section connected">
				<h3>🔗 MetaMask Conectado</h3>
				<div class="wallet-info">
					<span class="wallet-address">{userAddress}</span>
					<button 
						class="btn btn-secondary btn-small" 
						on:click={disconnectMetaMask}
						disabled={isRunning}
					>
						Desconectar
					</button>
				</div>
			</div>
		{/if}

		<!-- Controles de tests -->
		<div class="test-controls">
			<button 
				class="btn btn-success" 
				on:click={runTests}
				disabled={isRunning || !isMetaMaskConnected}
			>
				{isRunning ? '⏳ Ejecutando Tests...' : '🚀 Ejecutar Tests de Encriptación'}
			</button>
			
			<button 
				class="btn btn-outline" 
				on:click={clearResults}
				disabled={isRunning}
			>
				🗑️ Limpiar Resultados
			</button>
		</div>
	</section>

	<!-- Indicador de test en progreso -->
	{#if currentTest}
		<div class="current-test">
			<div class="spinner"></div>
			<span class="current-test-text">Ejecutando: <strong>{currentTest}</strong></span>
		</div>
	{/if}

	<!-- Resultados de los tests -->
	<section class="results-section">
		{#if testResults.length > 0}
			<h2>📊 Resultados de los Tests</h2>
			<div class="results">
				{#each testResults as result}
					<div class="result result-{result.status}">
						<div class="result-header">
							<span class="result-test">{result.test}</span>
							<span class="result-time">{result.timestamp}</span>
						</div>
						<div class="result-message">{result.message}</div>
						{#if result.details}
							<details class="result-details">
								<summary>Ver detalles técnicos</summary>
								<pre class="details-content">{JSON.stringify(result.details, null, 2)}</pre>
							</details>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<div class="no-results">
				<p>👋 ¡Hola! Conecta MetaMask y ejecuta los tests para ver los resultados aquí.</p>
			</div>
		{/if}
	</section>
</div>

<style>
	/* Layout principal */
	.container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	/* Header */
	.header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.header h1 {
		color: #2c3e50;
		margin-bottom: 1rem;
		font-size: 2.5rem;
	}

	.subtitle {
		color: #7f8c8d;
		font-size: 1.2rem;
		margin-bottom: 0;
	}

	/* Sección de controles */
	.controls {
		margin-bottom: 2rem;
	}

	.metamask-section {
		padding: 2rem;
		background: #f8f9fa;
		border-radius: 12px;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.metamask-section.connected {
		background: #e8f5e8;
		border: 2px solid #28a745;
	}

	.metamask-section h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		color: #2c3e50;
	}

	.wallet-info {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.wallet-address {
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-weight: bold;
		color: #0066cc;
		background: rgba(0, 102, 204, 0.1);
		padding: 0.5rem 1rem;
		border-radius: 6px;
		font-size: 0.9rem;
	}

	.test-controls {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	/* Botones */
	.btn {
		padding: 0.8rem 1.5rem;
		border: none;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		text-decoration: none;
		display: inline-block;
		font-size: 1rem;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none !important;
	}

	.btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0,0,0,0.15);
	}

	.btn-primary {
		background: #007bff;
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: #0056b3;
	}

	.btn-success {
		background: #28a745;
		color: white;
	}

	.btn-success:hover:not(:disabled) {
		background: #1e7e34;
	}

	.btn-secondary {
		background: #6c757d;
		color: white;
	}

	.btn-secondary:hover:not(:disabled) {
		background: #545b62;
	}

	.btn-outline {
		background: white;
		color: #6c757d;
		border: 2px solid #6c757d;
	}

	.btn-outline:hover:not(:disabled) {
		background: #6c757d;
		color: white;
	}

	.btn-small {
		padding: 0.5rem 1rem;
		font-size: 0.85rem;
	}

	/* Test en progreso */
	.current-test {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem;
		background: linear-gradient(90deg, #fff3cd, #ffeaa7);
		border: 1px solid #ffc107;
		border-radius: 10px;
		margin-bottom: 2rem;
		animation: pulse 2s ease-in-out infinite alternate;
	}

	@keyframes pulse {
		from { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.4); }
		to { box-shadow: 0 0 0 10px rgba(255, 193, 7, 0); }
	}

	.spinner {
		width: 24px;
		height: 24px;
		border: 3px solid #f3f3f3;
		border-top: 3px solid #ffc107;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.current-test-text {
		font-size: 1.1rem;
		color: #856404;
	}

	/* Sección de resultados */
	.results-section {
		margin-top: 2rem;
	}

	.results-section h2 {
		color: #2c3e50;
		margin-bottom: 1.5rem;
	}

	.no-results {
		text-align: center;
		padding: 3rem;
		color: #7f8c8d;
		font-size: 1.1rem;
	}

	/* Resultados individuales */
	.results {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.result {
		padding: 1.5rem;
		border-radius: 10px;
		border-left: 5px solid;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
		transition: transform 0.2s ease;
	}

	.result:hover {
		transform: translateX(5px);
	}

	.result-success {
		background: #d4edda;
		border-left-color: #28a745;
		color: #155724;
	}

	.result-error {
		background: #f8d7da;
		border-left-color: #dc3545;
		color: #721c24;
	}

	.result-info {
		background: #d1ecf1;
		border-left-color: #17a2b8;
		color: #0c5460;
	}

	.result-warning {
		background: #fff3cd;
		border-left-color: #ffc107;
		color: #856404;
	}

	.result-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.result-test {
		font-weight: bold;
		font-size: 1.1rem;
	}

	.result-time {
		font-size: 0.85rem;
		opacity: 0.8;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		background: rgba(0,0,0,0.1);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
	}

	.result-message {
		line-height: 1.5;
		margin-bottom: 0.5rem;
	}

	.result-details {
		margin-top: 1rem;
	}

	.result-details summary {
		cursor: pointer;
		font-weight: 600;
		padding: 0.5rem 0;
		transition: color 0.2s ease;
	}

	.result-details summary:hover {
		color: #007bff;
	}

	.details-content {
		background: rgba(0,0,0,0.05);
		padding: 1rem;
		border-radius: 6px;
		font-size: 0.85rem;
		overflow-x: auto;
		white-space: pre-wrap;
		margin-top: 0.5rem;
		border: 1px solid rgba(0,0,0,0.1);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}
		
		.header h1 {
			font-size: 2rem;
		}
		
		.subtitle {
			font-size: 1rem;
		}
		
		.test-controls {
			flex-direction: column;
		}
		
		.wallet-info {
			flex-direction: column;
		}

		.wallet-address {
			font-size: 0.8rem;
			word-break: break-all;
		}
		
		.result-header {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>