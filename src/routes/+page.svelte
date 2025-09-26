<script>
	import { connectWallet, isConnected } from '$lib/stores/auth.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let publicAddress = '';
	let loading = false;
	let error = '';

	$: if ($isConnected) {
		goto('/dashboard');
	}

	async function handleLogin() {
		if (!publicAddress.trim()) {
			error = 'Por favor ingresa una dirección pública';
			return;
		}

		if (!/^0x[a-fA-F0-9]{40}$/.test(publicAddress)) {
			error = 'Dirección inválida. Debe ser una dirección Ethereum válida';
			return;
		}

		console.log('Iniciando proceso de login...');
		console.log('Dirección ingresada:', publicAddress);

		loading = true;
		error = '';

		try {
			console.log('Llamando a connectWallet...');
			const result = await connectWallet(publicAddress);
			console.log('Resultado:', result);

			if (result.success) {
				console.log('Conexión exitosa, redirigiendo...');
				goto('/dashboard');
			} else {
				console.error('Error de conexión:', result.error);
				error = result.error;
			}
		} catch (err) {
			console.error('Error inesperado:', err);
			error = 'Error inesperado: ' + err.message;
		} finally {
			loading = false;
		}
	}

	async function testMetaMask() {
		console.log('Probando detección de MetaMask...');
		console.log('window.ethereum:', !!window.ethereum);

		if (window.ethereum) {
			try {
				const accounts = await window.ethereum.request({ method: 'eth_accounts' });
				console.log('Cuentas disponibles:', accounts);

				if (accounts.length > 0) {
					console.log('Cuenta activa detectada:', accounts[0]);
					publicAddress = accounts[0];
				}
			} catch (err) {
				console.error('Error obteniendo cuentas:', err);
			}
		}
	}

	onMount(() => {
		if (typeof window !== 'undefined') {
			if (!window.ethereum) {
				error = 'MetaMask no está instalada. Por favor instálala para continuar.';
			} else {
				console.log('MetaMask detectada');
				testMetaMask();
			}
		}
	});
</script>

<svelte:head>
	<title>MessageCrypto - Login</title>
</svelte:head>

<div class="container">
	<div class="login-card">
		<h1>🔐 MessageCrypto</h1>
		<p>Plataforma de anuncios con mensajes cifrados</p>

		<form on:submit|preventDefault={handleLogin}>
			<div class="input-group">
				<label for="address">Dirección Pública Ethereum</label>
				<input
					id="address"
					type="text"
					bind:value={publicAddress}
					placeholder="0x..."
					disabled={loading}
				/>
			</div>

			{#if error}
				<div class="error">{error}</div>
			{/if}

			<button type="submit" disabled={loading || !publicAddress.trim()}>
				{loading ? 'Conectando...' : 'Conectar con MetaMask'}
			</button>
		</form>

		<div class="debug-section">
			<button type="button" on:click={testMetaMask} class="debug-btn">
				🔍 Detectar MetaMask
			</button>
		</div>

		<div class="info">
			<h3>¿Cómo funciona?</h3>
			<ol>
				<li>Ingresa tu dirección pública de Ethereum</li>
				<li>Confirma tu identidad firmando un mensaje con MetaMask</li>
				<li>Accede al panel de anuncios cifrados</li>
			</ol>
		</div>

		<div class="test-link">
			<a href="/test">🧪 Página de Pruebas EIP-5630</a>
		</div>
	</div>
</div>

<style>
	.container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
	}

	.login-card {
		background: white;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		padding: 3rem;
		max-width: 500px;
		width: 100%;
		text-align: center;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		color: #1e293b;
	}

	p {
		color: #64748b;
		margin-bottom: 2rem;
	}

	.input-group {
		margin-bottom: 1.5rem;
		text-align: left;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: #374151;
	}

	form {
		margin-bottom: 2rem;
	}

	.info {
		text-align: left;
		background: #f8fafc;
		padding: 1.5rem;
		border-radius: 0.5rem;
		border: 1px solid #e2e8f0;
	}

	.info h3 {
		color: #1e293b;
		margin-bottom: 1rem;
	}

	.info ol {
		padding-left: 1.5rem;
	}

	.info li {
		margin-bottom: 0.5rem;
		color: #64748b;
	}

	.debug-section {
		margin: 1rem 0;
		padding: 1rem 0;
		border-top: 1px solid #e2e8f0;
		border-bottom: 1px solid #e2e8f0;
	}

	.debug-btn {
		background: #6b7280;
		font-size: 0.875rem;
		padding: 0.5rem 1rem;
	}

	.debug-btn:hover {
		background: #4b5563;
	}

	.test-link {
		margin-top: 2rem;
		text-align: center;
		padding-top: 1rem;
		border-top: 1px solid #e2e8f0;
	}

	.test-link a {
		display: inline-block;
		color: #3b82f6;
		text-decoration: none;
		font-weight: 500;
		padding: 0.75rem 1.5rem;
		border: 1px solid #3b82f6;
		border-radius: 0.5rem;
		transition: all 0.2s;
	}

	.test-link a:hover {
		background: #3b82f6;
		color: white;
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
	}
</style>