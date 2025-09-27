<script>
	import { isConnected, userAddress, signer } from '$lib/stores/auth.js';
	import { ads, getAds, sendMessage } from '$lib/stores/ads.js';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	// Redirect only on client side
	onMount(() => {
		if (browser && !$isConnected) {
			goto('/');
		}
		getAds();
	});

	let showMessageModal = false;
	let selectedAd = null;
	let messageText = '';
	let sending = false;
	let error = '';

	function openMessageModal(ad) {
		selectedAd = ad;
		showMessageModal = true;
		messageText = '';
		error = '';
	}

	function closeMessageModal() {
		showMessageModal = false;
		selectedAd = null;
		messageText = '';
		error = '';
	}

	async function handleSendMessage() {
		if (!messageText.trim()) {
			error = 'Por favor escribe un mensaje';
			return;
		}

		sending = true;
		error = '';

		try {
			const result = await sendMessage(
				selectedAd.id,
				messageText,
				$userAddress
			);

			if (result.success) {
				alert('¡Mensaje enviado exitosamente!');
				closeMessageModal();
			} else {
				error = result.error;
			}
		} catch (err) {
			error = 'Error al enviar mensaje: ' + err.message;
		} finally {
			sending = false;
		}
	}

	function goBack() {
		goto('/dashboard');
	}

	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Anuncios - MessageCrypto</title>
</svelte:head>

{#if $isConnected}
	<div class="container">
		<header>
			<button class="back-btn" on:click={goBack}>← Volver al Dashboard</button>
			<h1>👀 Explorar Anuncios</h1>
		</header>

		<div class="ads-grid">
			{#if $ads.length === 0}
				<div class="empty-state">
					<span class="empty-icon">📭</span>
					<h3>No hay anuncios disponibles</h3>
					<p>Sé el primero en crear un anuncio</p>
					<button on:click={() => goto('/dashboard/create')}>
						Crear Anuncio
					</button>
				</div>
			{:else}
				{#each $ads as ad}
					<div class="ad-card">
						<div class="ad-image">
							<img src={ad.imageUrl} alt={ad.title} />
						</div>

						<div class="ad-content">
							<h3>{ad.title}</h3>
							<p class="ad-description">{ad.description}</p>

							{#if ad.price}
								<div class="ad-price">{ad.price}</div>
							{/if}

							<div class="ad-meta">
								<span class="ad-creator">
									Por: {ad.creator.slice(0, 6)}...{ad.creator.slice(-4)}
								</span>
								<span class="ad-date">{formatDate(ad.createdAt)}</span>
							</div>

							<div class="ad-stats">
								<span>💬 {ad.messages.length} mensajes</span>
							</div>

							{#if ad.creator !== $userAddress}
								<button
									class="message-btn"
									on:click={() => openMessageModal(ad)}
								>
									💌 Enviar Mensaje Cifrado
								</button>
							{:else}
								<div class="own-ad">
									<span>📝 Tu anuncio</span>
									<button on:click={() => goto(`/dashboard/messages/${ad.id}`)}>
										Ver Mensajes
									</button>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>

	<!-- Modal para enviar mensaje -->
	{#if showMessageModal}
		<div
			class="modal-overlay"
			role="button"
			tabindex="0"
			aria-label="Cerrar modal"
			on:click={closeMessageModal}
			on:keydown={(e) => { if (e.key === 'Enter') closeMessageModal(); }}
		>
			<div
				class="modal"
				role="dialog"
				aria-modal="true"
				on:click|stopPropagation
				tabindex="0"
				on:keydown={(e) => { if (e.key === 'Escape') closeMessageModal(); }}
			>
				<div class="modal-header">
					<h3>💌 Enviar Mensaje Cifrado</h3>
					<button class="close-btn" on:click={closeMessageModal}>×</button>
				</div>

				<div class="modal-content">
					<div class="ad-info">
						<h4>{selectedAd.title}</h4>
						<p>Para: {selectedAd.creator.slice(0, 6)}...{selectedAd.creator.slice(-4)}</p>
					</div>

					<div class="input-group">
						<label for="message">Tu mensaje (se cifrará automáticamente)</label>
						<textarea
							id="message"
							bind:value={messageText}
							placeholder="Escribe tu mensaje aquí..."
							rows="4"
							disabled={sending}
						></textarea>
					</div>

					{#if error}
						<div class="error">{error}</div>
					{/if}

					<div class="modal-actions">
						<button type="button" on:click={closeMessageModal} disabled={sending}>
							Cancelar
						</button>
						<button
							type="button"
							on:click={handleSendMessage}
							disabled={sending || !messageText.trim()}
						>
							{sending ? 'Enviando...' : '🔐 Enviar Cifrado'}
						</button>
					</div>

					<div class="encryption-info">
						<small>
							🔒 Tu mensaje será cifrado usando criptografía y solo el vendedor podrá leerlo con su wallet.
						</small>
					</div>
				</div>
			</div>
		</div>
	{/if}
{/if}

<style>
	header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.back-btn {
		background: #6b7280;
		font-size: 0.875rem;
		padding: 0.5rem 1rem;
	}

	.back-btn:hover {
		background: #4b5563;
	}

	h1 {
		font-size: 2rem;
		color: #1e293b;
	}

	.ads-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 2rem;
	}

	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		padding: 4rem 2rem;
		background: white;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.empty-icon {
		font-size: 4rem;
		display: block;
		margin-bottom: 1rem;
	}

	.empty-state h3 {
		color: #1e293b;
		margin-bottom: 1rem;
	}

	.empty-state p {
		color: #64748b;
		margin-bottom: 2rem;
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

	.ad-image {
		width: 100%;
		height: 200px;
		overflow: hidden;
	}

	.ad-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.ad-content {
		padding: 1.5rem;
	}

	.ad-content h3 {
		color: #1e293b;
		margin-bottom: 0.5rem;
		font-size: 1.25rem;
	}

	.ad-description {
		color: #64748b;
		margin-bottom: 1rem;
		line-height: 1.6;
	}

	.ad-price {
		background: #10b981;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		font-weight: 600;
		display: inline-block;
		margin-bottom: 1rem;
	}

	.ad-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.ad-creator {
		font-family: monospace;
	}

	.ad-stats {
		margin-bottom: 1rem;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.message-btn {
		width: 100%;
		background: #3b82f6;
		margin-bottom: 0.5rem;
	}

	.message-btn:hover {
		background: #2563eb;
	}

	.own-ad {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: #f8fafc;
		border-radius: 0.5rem;
		border: 1px solid #e2e8f0;
	}

	.own-ad span {
		color: #10b981;
		font-weight: 600;
	}

	.own-ad button {
		background: #10b981;
		font-size: 0.875rem;
		padding: 0.5rem 1rem;
	}

	.own-ad button:hover {
		background: #059669;
	}

	/* Modal styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal {
		background: white;
		border-radius: 1rem;
		max-width: 500px;
		width: 90%;
		max-height: 90vh;
		overflow-y: auto;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid #e2e8f0;
	}

	.modal-header h3 {
		color: #1e293b;
		font-size: 1.25rem;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		color: #6b7280;
		cursor: pointer;
		padding: 0;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-btn:hover {
		color: #374151;
		background: #f3f4f6;
		border-radius: 0.25rem;
	}

	.modal-content {
		padding: 1.5rem;
	}

	.ad-info {
		background: #f8fafc;
		padding: 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.ad-info h4 {
		color: #1e293b;
		margin-bottom: 0.5rem;
	}

	.ad-info p {
		color: #64748b;
		font-family: monospace;
		font-size: 0.875rem;
	}

	.input-group {
		margin-bottom: 1.5rem;
	}

	.input-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: #374151;
	}

	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-family: inherit;
		resize: vertical;
	}

	textarea:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.modal-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		margin-bottom: 1rem;
	}

	.modal-actions button[type="button"]:first-child {
		background: #6b7280;
	}

	.modal-actions button[type="button"]:first-child:hover {
		background: #4b5563;
	}

	.encryption-info {
		background: #eff6ff;
		padding: 1rem;
		border-radius: 0.5rem;
		border: 1px solid #dbeafe;
	}

	.encryption-info small {
		color: #1e40af;
		line-height: 1.4;
	}
</style>