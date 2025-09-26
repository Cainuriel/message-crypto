<script>
	import { isConnected, userAddress, disconnect } from '$lib/stores/auth.js';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	// Redirect only on client side
	onMount(() => {
		if (browser && !$isConnected) {
			goto('/');
		}
	});

	function handleDisconnect() {
		disconnect();
		goto('/');
	}

	function goToCreate() {
		goto('/dashboard/create');
	}
</script>

<svelte:head>
	<title>Dashboard - MessageCrypto</title>
</svelte:head>

{#if $isConnected}
	<div class="container">
		<header>
			<div class="header-content">
				<h1>🔐 MessageCrypto</h1>
				<div class="user-info">
					<span class="address">{$userAddress.slice(0, 6)}...{$userAddress.slice(-4)}</span>
					<button class="disconnect-btn" on:click={handleDisconnect}>Desconectar</button>
				</div>
			</div>
		</header>

		<main>
			<div class="welcome-card">
				<h2>Bienvenido al Panel de Anuncios</h2>
				<p>Crea anuncios con mensajes cifrados o explora los anuncios existentes</p>
			</div>

			<div class="actions">
				<div class="action-card">
					<h3>📝 Crear Anuncio</h3>
					<p>Sube una imagen, escribe tu anuncio y configura la clave de cifrado para los mensajes</p>
					<button on:click={goToCreate}>Crear Nuevo Anuncio</button>
				</div>

				<div class="action-card">
					<h3>👀 Ver Anuncios</h3>
					<p>Explora los anuncios creados y envía mensajes cifrados a los vendedores</p>
					<button on:click={() => goto('/dashboard/ads')}>Ver Anuncios</button>
				</div>
			</div>

			<div class="stats">
				<div class="stat-item">
					<span class="stat-number">0</span>
					<span class="stat-label">Anuncios Creados</span>
				</div>
				<div class="stat-item">
					<span class="stat-number">0</span>
					<span class="stat-label">Mensajes Recibidos</span>
				</div>
			</div>
		</main>
	</div>
{/if}

<style>
	header {
		background: white;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
	}

	.header-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	h1 {
		font-size: 1.5rem;
		color: #1e293b;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.address {
		background: #f1f5f9;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		font-family: monospace;
		color: #475569;
	}

	.disconnect-btn {
		background: #ef4444;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
	}

	.disconnect-btn:hover {
		background: #dc2626;
	}

	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	.welcome-card {
		background: linear-gradient(135deg, #3b82f6, #1d4ed8);
		color: white;
		padding: 3rem;
		border-radius: 1rem;
		text-align: center;
		margin-bottom: 3rem;
	}

	.welcome-card h2 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	.actions {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-bottom: 3rem;
	}

	.action-card {
		background: white;
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	.action-card h3 {
		color: #1e293b;
		margin-bottom: 1rem;
		font-size: 1.25rem;
	}

	.action-card p {
		color: #64748b;
		margin-bottom: 2rem;
		line-height: 1.6;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 2rem;
	}

	.stat-item {
		background: white;
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	.stat-number {
		display: block;
		font-size: 3rem;
		font-weight: bold;
		color: #3b82f6;
		margin-bottom: 0.5rem;
	}

	.stat-label {
		color: #64748b;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
</style>