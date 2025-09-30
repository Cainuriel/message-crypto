<script>
	import { isConnected, userAddress, disconnect } from '$lib/stores/auth.js';
	import { ads, getAds, clearAllData } from '$lib/stores/ads.js';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	// Redirect only on client side
	onMount(() => {
		if (browser && !$isConnected) {
			goto('/');
		} else {
			// Cargar anuncios
			getAds();
		}
	});

	function goToCreate() {
		goto('/dashboard/create');
	}

	function goToMessages(adId) {
		goto(`/dashboard/messages/${adId}`);
	}

	function goToSendMessage(adId) {
		goto(`/dashboard/ads/${adId}`);
	}

	function handleDisconnect() {
		disconnect();
		goto('/');
	}

	function handleClearData() {
		if (confirm('¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.')) {
			clearAllData();
			alert('Todos los datos han sido eliminados.');
		}
	}

	function formatDate(isoString) {
		const date = new Date(isoString);
		return date.toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function truncateText(text, maxLength = 100) {
		if (text.length <= maxLength) return text;
		return text.substring(0, maxLength) + '...';
	}

	// Separar anuncios propios y de otros
	$: myAds = $ads.filter(ad => ad.creator === $userAddress);
	$: otherAds = $ads.filter(ad => ad.creator !== $userAddress);
</script>

<svelte:head>
	<title>Dashboard - MessageCrypto</title>
</svelte:head>

{#if $isConnected}
	<div class="container">
		<header class="page-header">
			<div class="header-content">
				<h1>Dashboard de Anuncios</h1>
				<p>Conectado como: <span class="address">{$userAddress}</span></p>
			</div>
			<div class="header-actions">
				<button class="btn-primary" on:click={goToCreate}>
					+ Crear Anuncio
				</button>
				<button class="btn-danger" on:click={handleClearData}>
					🗑️ Limpiar Datos
				</button>
				<button class="btn-secondary" on:click={handleDisconnect}>
					Desconectar
				</button>
			</div>
		</header>

		<!-- Mis Anuncios -->
		<section class="ads-section">
			<h2>Mis Anuncios ({myAds.length})</h2>
			
			{#if myAds.length === 0}
				<div class="empty-state">
					<p>No has creado ningún anuncio aún.</p>
					<button class="btn-primary" on:click={goToCreate}>
						Crear mi primer anuncio
					</button>
				</div>
			{:else}
				<div class="ads-grid">
					{#each myAds as ad}
						<div class="ad-card my-ad">
							<div class="ad-image">
								<img src={ad.imageUrl} alt={ad.title} />
								<div class="ad-badge own">Tuyo</div>
							</div>
							<div class="ad-content">
								<h3>{ad.title}</h3>
								<p class="ad-description">{truncateText(ad.description)}</p>
								{#if ad.price}
									<p class="ad-price">{ad.price}</p>
								{/if}
								<p class="ad-meta">
									<span>Creado: {formatDate(ad.createdAt)}</span>
									<span class="messages-count">
										{ad.messageCount || 0} mensajes
									</span>
								</p>
								<div class="ad-encryption">
									<small>Clave: {ad.publicKey.substring(0, 20)}...</small>
								</div>
							</div>
							<div class="ad-actions">
								<button class="btn-messages" on:click={() => goToMessages(ad.id)}>
									Ver Mensajes ({ad.messageCount || 0})
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</section>

		<!-- Anuncios de Otros -->
		<section class="ads-section">
			<h2>Otros Anuncios ({otherAds.length})</h2>
			
			{#if otherAds.length === 0}
				<div class="empty-state">
					<p>No hay otros anuncios disponibles.</p>
				</div>
			{:else}
				<div class="ads-grid">
					{#each otherAds as ad}
						<div class="ad-card other-ad">
							<div class="ad-image">
								<img src={ad.imageUrl} alt={ad.title} />
								<div class="ad-badge other">Otro usuario</div>
							</div>
							<div class="ad-content">
								<h3>{ad.title}</h3>
								<p class="ad-description">{truncateText(ad.description)}</p>
								{#if ad.price}
									<p class="ad-price">{ad.price}</p>
								{/if}
								<p class="ad-meta">
									<span>Por: {ad.creator.substring(0, 6)}...{ad.creator.substring(-4)}</span>
									<span>Creado: {formatDate(ad.createdAt)}</span>
								</p>
								<div class="ad-encryption">
									<small>Mensajes cifrados con clave pública</small>
								</div>
							</div>
							<div class="ad-actions">
								<button class="btn-contact" on:click={() => goToSendMessage(ad.id)}>
									Enviar Mensaje Cifrado
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</section>

		<!-- Test Link -->
		<div class="test-section">
			<a href="/test" class="test-link">
				Ir a página de pruebas de encriptación
			</a>
		</div>
	</div>
{:else}
	<div class="container">
		<div class="error-container">
			<h1>Acceso Denegado</h1>
			<p>Necesitas estar conectado para ver el dashboard.</p>
			<button on:click={() => goto('/')} class="btn-primary">
				Ir al Login
			</button>
		</div>
	</div>
{/if}

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 3rem;
		padding-bottom: 1rem;
		border-bottom: 2px solid #e5e7eb;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.header-content h1 {
		color: #1e293b;
		margin-bottom: 0.5rem;
		font-size: 2.5rem;
	}

	.header-content p {
		color: #64748b;
		margin: 0;
	}

	.address {
		font-family: monospace;
		background: #f1f5f9;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-weight: 600;
	}

	.header-actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.ads-section {
		margin-bottom: 3rem;
	}

	.ads-section h2 {
		color: #374151;
		margin-bottom: 1.5rem;
		font-size: 1.5rem;
		border-left: 4px solid #3b82f6;
		padding-left: 1rem;
	}

	.ads-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 1.5rem;
	}

	.ad-card {
		background: white;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.ad-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
	}

	.my-ad {
		border: 2px solid #16a34a;
	}

	.other-ad {
		border: 2px solid #3b82f6;
	}

	.ad-image {
		position: relative;
		height: 200px;
		overflow: hidden;
	}

	.ad-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.ad-badge {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: white;
	}

	.ad-badge.own {
		background: #16a34a;
	}

	.ad-badge.other {
		background: #3b82f6;
	}

	.ad-content {
		padding: 1.5rem;
	}

	.ad-content h3 {
		color: #1e293b;
		margin-bottom: 0.5rem;
		font-size: 1.25rem;
		line-height: 1.3;
	}

	.ad-description {
		color: #64748b;
		margin-bottom: 1rem;
		line-height: 1.5;
	}

	.ad-price {
		color: #059669;
		font-weight: 600;
		font-size: 1.1rem;
		margin-bottom: 1rem;
	}

	.ad-meta {
		color: #6b7280;
		font-size: 0.875rem;
		margin-bottom: 1rem;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.messages-count {
		background: #f59e0b;
		color: white;
		padding: 0.125rem 0.5rem;
		border-radius: 0.75rem;
		font-weight: 600;
	}

	.ad-encryption {
		background: #f0f9ff;
		padding: 0.5rem;
		border-radius: 0.25rem;
		border: 1px solid #e0f2fe;
	}

	.ad-encryption small {
		color: #0c4a6e;
		font-family: monospace;
	}

	.ad-actions {
		padding: 1rem 1.5rem;
		background: #f8fafc;
		border-top: 1px solid #e5e7eb;
	}

	.btn-primary {
		background: #16a34a;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
		transition: background-color 0.2s;
	}

	.btn-primary:hover {
		background: #15803d;
	}

	.btn-secondary {
		background: #6b7280;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		cursor: pointer;
		font-size: 1rem;
		transition: background-color 0.2s;
	}

	.btn-secondary:hover {
		background: #4b5563;
	}

	.btn-danger {
		background: #dc2626;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		cursor: pointer;
		font-size: 1rem;
		transition: background-color 0.2s;
	}

	.btn-danger:hover {
		background: #b91c1c;
	}

	.btn-messages {
		background: #f59e0b;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		width: 100%;
		transition: background-color 0.2s;
	}

	.btn-messages:hover {
		background: #d97706;
	}

	.btn-contact {
		background: #3b82f6;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		width: 100%;
		transition: background-color 0.2s;
	}

	.btn-contact:hover {
		background: #2563eb;
	}

	.empty-state {
		text-align: center;
		padding: 3rem 2rem;
		background: white;
		border-radius: 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.empty-state p {
		color: #6b7280;
		margin-bottom: 1.5rem;
		font-size: 1.1rem;
	}

	.test-section {
		text-align: center;
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid #e5e7eb;
	}

	.test-link {
		display: inline-block;
		color: #6b7280;
		text-decoration: none;
		font-size: 0.875rem;
		padding: 0.5rem 1rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		transition: all 0.2s;
	}

	.test-link:hover {
		background: #f9fafb;
		color: #374151;
	}

	.error-container {
		text-align: center;
		padding: 3rem 2rem;
		background: white;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.error-container h1 {
		color: #dc2626;
		margin-bottom: 1rem;
	}

	.error-container p {
		color: #6b7280;
		margin-bottom: 2rem;
	}

	@media (max-width: 768px) {
		.page-header {
			flex-direction: column;
			align-items: stretch;
		}

		.header-actions {
			justify-content: center;
		}

		.ads-grid {
			grid-template-columns: 1fr;
		}
	}
</style>