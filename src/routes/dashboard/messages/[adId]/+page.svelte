<script>
	import { isConnected, userAddress, signer } from '$lib/stores/auth.js';
	import { ads, getMessagesForAd, decryptMessage } from '$lib/stores/ads.js';
	import { SimpleSymmetricCrypto } from '$lib/crypto/eip5630.js';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	// Redirect only on client side
	onMount(() => {
		if (browser && !$isConnected) {
			goto('/');
			return;
		}

		currentAd = $ads.find(ad => ad.id === adId);
		if (!currentAd) {
			goto('/dashboard/ads');
			return;
		}

		if (currentAd.creator !== $userAddress) {
			goto('/dashboard/ads');
			return;
		}

		messages = getMessagesForAd(adId);
	});

	$: adId = $page.params.adId;
	let currentAd = null;
	let messages = [];
	let decryptedMessages = {};
	let error = '';
	let loading = false;

	async function decryptAllMessages() {
		loading = true;
		error = '';
		const newDecryptedMessages = {};

		try {
			for (const message of messages) {
				try {
					console.log(`Descifrando mensaje ${message.id}...`);
					const result = await decryptMessage(message.id, adId, $signer);

					if (result.success) {
						newDecryptedMessages[message.id] = {
							text: result.decryptedText,
							success: true
						};
					} else {
						newDecryptedMessages[message.id] = {
							text: 'Error al descifrar: ' + result.error,
							success: false
						};
					}
				} catch (err) {
					console.error(`Error descifrando mensaje ${message.id}:`, err);
					newDecryptedMessages[message.id] = {
						text: 'Error al descifrar mensaje',
						success: false
					};
				}
			}

			decryptedMessages = newDecryptedMessages;
		} catch (err) {
			error = 'Error al descifrar mensajes: ' + err.message;
		} finally {
			loading = false;
		}
	}

	function goBack() {
		goto('/dashboard/ads');
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
	<title>Mensajes - {currentAd?.title || 'MessageCrypto'}</title>
</svelte:head>

{#if $isConnected && currentAd}
	<div class="container">
		<header>
			<button class="back-btn" on:click={goBack}>← Volver a Anuncios</button>
			<h1>💌 Mensajes del Anuncio</h1>
		</header>

		<div class="ad-info">
			<div class="ad-preview">
				<img src={currentAd.imageUrl} alt={currentAd.title} />
				<div class="ad-details">
					<h3>{currentAd.title}</h3>
					<p>{currentAd.description}</p>
					{#if currentAd.price}
						<span class="price">{currentAd.price}</span>
					{/if}
				</div>
			</div>
		</div>

		<div class="decryption-panel">
			<h3>🔐 Descifrar Mensajes con MetaMask</h3>
			<p>Los mensajes están cifrados con tu clave pública. Usa MetaMask para descifrarlos de forma segura.</p>

			<div class="decrypt-actions">
				<button
					on:click={decryptAllMessages}
					disabled={loading}
					class="decrypt-btn"
				>
					{loading ? 'Descifrando con MetaMask...' : '🔓 Descifrar Todos los Mensajes'}
				</button>
			</div>

			{#if error}
				<div class="error">{error}</div>
			{/if}

			<div class="crypto-info">
				<div class="info-item">
					<span class="info-icon">🔑</span>
					<span>Se usará tu clave privada de MetaMask para descifrar</span>
				</div>
				<div class="info-item">
					<span class="info-icon">🔒</span>
					<span>Solo tú puedes acceder a estos mensajes</span>
				</div>
			</div>
		</div>

		<div class="messages-section">
			<h3>📬 Mensajes Recibidos ({messages.length})</h3>

			{#if messages.length === 0}
				<div class="empty-messages">
					<span class="empty-icon">📭</span>
					<h4>No hay mensajes aún</h4>
					<p>Los compradores interesados podrán enviarte mensajes cifrados</p>
				</div>
			{:else}
				<div class="messages-list">
					{#each messages as message}
						<div class="message-card">
							<div class="message-header">
								<span class="sender">
									De: {message.sender.slice(0, 6)}...{message.sender.slice(-4)}
								</span>
								<span class="timestamp">{formatDate(message.timestamp)}</span>
							</div>

							<div class="message-content">
								{#if decryptedMessages[message.id]}
									<div class="decrypted-message" class:error={!decryptedMessages[message.id].success}>
										<div class="message-label">
											{decryptedMessages[message.id].success ? '📝 Mensaje descifrado:' : '❌ Error:'}
										</div>
										<div class="message-text">
											{decryptedMessages[message.id].text}
										</div>
									</div>
								{:else}
									<div class="encrypted-message">
										<div class="message-label">🔒 Mensaje cifrado:</div>
										<div class="encrypted-preview">
											[Mensaje cifrado - Usa tu clave para descifrar]
										</div>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
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

	.ad-info {
		background: white;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		padding: 2rem;
		margin-bottom: 2rem;
	}

	.ad-preview {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	.ad-preview img {
		width: 120px;
		height: 120px;
		object-fit: cover;
		border-radius: 0.5rem;
	}

	.ad-details h3 {
		color: #1e293b;
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
	}

	.ad-details p {
		color: #64748b;
		margin-bottom: 1rem;
		line-height: 1.6;
	}

	.price {
		background: #10b981;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		font-weight: 600;
	}

	.decryption-panel {
		background: white;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		padding: 2rem;
		margin-bottom: 2rem;
	}

	.decryption-panel h3 {
		color: #1e293b;
		margin-bottom: 0.5rem;
	}

	.decryption-panel p {
		color: #64748b;
		margin-bottom: 1.5rem;
	}

	.decrypt-actions {
		display: flex;
		justify-content: center;
		margin-bottom: 1.5rem;
	}

	.decrypt-btn {
		background: #10b981;
		padding: 1rem 2rem;
		font-size: 1rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.decrypt-btn:hover {
		background: #059669;
	}

	.crypto-info {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		background: #f0f9ff;
		padding: 1rem;
		border-radius: 0.5rem;
		border: 1px solid #bae6fd;
	}

	.info-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.875rem;
		color: #1e40af;
	}

	.info-icon {
		font-size: 1rem;
		min-width: 1.25rem;
	}

	.messages-section {
		background: white;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		padding: 2rem;
	}

	.messages-section h3 {
		color: #1e293b;
		margin-bottom: 2rem;
	}

	.empty-messages {
		text-align: center;
		padding: 3rem 2rem;
		color: #6b7280;
	}

	.empty-icon {
		font-size: 3rem;
		display: block;
		margin-bottom: 1rem;
	}

	.empty-messages h4 {
		color: #374151;
		margin-bottom: 0.5rem;
	}

	.messages-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.message-card {
		border: 1px solid #e2e8f0;
		border-radius: 0.75rem;
		padding: 1.5rem;
		background: #fafafa;
	}

	.message-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		font-size: 0.875rem;
	}

	.sender {
		color: #3b82f6;
		font-family: monospace;
		font-weight: 600;
	}

	.timestamp {
		color: #6b7280;
	}

	.message-content {
		border-top: 1px solid #e2e8f0;
		padding-top: 1rem;
	}

	.message-label {
		font-size: 0.875rem;
		color: #6b7280;
		margin-bottom: 0.5rem;
		font-weight: 600;
	}

	.decrypted-message {
		background: #f0f9ff;
		border: 1px solid #bae6fd;
		border-radius: 0.5rem;
		padding: 1rem;
	}

	.decrypted-message.error {
		background: #fef2f2;
		border-color: #fecaca;
	}

	.decrypted-message.error .message-label {
		color: #dc2626;
	}

	.message-text {
		color: #1e293b;
		line-height: 1.6;
		white-space: pre-wrap;
	}

	.encrypted-message {
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 0.5rem;
		padding: 1rem;
	}

	.encrypted-preview {
		color: #64748b;
		font-style: italic;
	}

	@media (max-width: 768px) {
		.ad-preview {
			flex-direction: column;
			text-align: center;
		}

		.decrypt-actions {
			flex-direction: column;
		}
	}
</style>