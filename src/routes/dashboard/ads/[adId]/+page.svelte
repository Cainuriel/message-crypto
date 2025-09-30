<script>
	import { page } from '$app/stores';
	import { isConnected, userAddress } from '$lib/stores/auth.js';
	import { getAdById, sendMessage } from '$lib/stores/ads.js';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let ad = null;
	let message = '';
	let loading = false;
	let error = '';
	let success = '';

	// Redirect only on client side
	onMount(() => {
		if (browser && !$isConnected) {
			goto('/');
		} else {
			loadAd();
		}
	});

	function loadAd() {
		const adId = $page.params.adId;
		ad = getAdById(adId);
		
		if (!ad) {
			error = 'Anuncio no encontrado';
			return;
		}

		// Verificar que no sea el propio anuncio
		if (ad.creator === $userAddress) {
			error = 'No puedes enviar mensajes a tu propio anuncio';
			return;
		}
	}

	async function handleSendMessage() {
		if (!message.trim()) {
			error = 'Por favor escribe un mensaje';
			return;
		}

		if (!ad) {
			error = 'Anuncio no encontrado';
			return;
		}

		loading = true;
		error = '';
		success = '';

		try {
			console.log('Enviando mensaje cifrado...');
			
			const result = await sendMessage(ad.id, message.trim(), $userAddress);

			if (result.success) {
				success = '¡Mensaje enviado exitosamente! El mensaje ha sido cifrado y solo el creador del anuncio puede leerlo.';
				message = '';
				
				// Redirigir después de un momento
				setTimeout(() => {
					goto('/dashboard');
				}, 3000);
			} else {
				error = result.error;
			}
		} catch (err) {
			console.error('Error enviando mensaje:', err);
			error = 'Error inesperado: ' + err.message;
		} finally {
			loading = false;
		}
	}

	function goBack() {
		goto('/dashboard');
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
</script>

<svelte:head>
	<title>Enviar Mensaje - MessageCrypto</title>
</svelte:head>

{#if $isConnected}
	<div class="container">
		<header class="page-header">
			<button class="btn-back" on:click={goBack}>
				← Volver al Dashboard
			</button>
			<h1>Enviar Mensaje Cifrado</h1>
		</header>

		{#if ad}
			<div class="ad-info">
				<div class="ad-preview">
					<img src={ad.imageUrl} alt={ad.title} />
					<div class="ad-details">
						<h2>{ad.title}</h2>
						<p class="ad-description">{ad.description}</p>
						{#if ad.price}
							<p class="ad-price">{ad.price}</p>
						{/if}
						<div class="ad-meta">
							<p><strong>Creador:</strong> {ad.creator.substring(0, 6)}...{ad.creator.substring(-4)}</p>
							<p><strong>Creado:</strong> {formatDate(ad.createdAt)}</p>
						</div>
					</div>
				</div>

				<div class="encryption-info">
					<h3>🔐 Información de Cifrado</h3>
					<div class="encryption-details">
						<p><strong>Clave Pública:</strong> <code>{ad.publicKey.substring(0, 30)}...</code></p>
						<p><strong>Dirección Derivada:</strong> <code>{ad.derivedAddress}</code></p>
						<div class="encryption-explanation">
							<p>Tu mensaje será cifrado usando la clave pública del anuncio. Solo el creador puede descifrarlo con su clave privada de MetaMask.</p>
						</div>
					</div>
				</div>
			</div>

			<form on:submit|preventDefault={handleSendMessage} class="message-form">
				<div class="form-group">
					<label for="message">Tu Mensaje Cifrado</label>
					<textarea
						id="message"
						bind:value={message}
						placeholder="Escribe tu mensaje aquí... será cifrado antes de enviarse"
						rows="6"
						disabled={loading}
						required
					></textarea>
					<small>El mensaje será cifrado automáticamente y solo el creador del anuncio podrá leerlo.</small>
				</div>

				{#if error}
					<div class="error-message">
						⚠️ {error}
					</div>
				{/if}

				{#if success}
					<div class="success-message">
						✅ {success}
					</div>
				{/if}

				<div class="form-actions">
					<button type="button" class="btn-secondary" on:click={goBack} disabled={loading}>
						Cancelar
					</button>
					<button type="submit" class="btn-primary" disabled={loading || !message.trim()}>
						{#if loading}
							🔄 Cifrando y Enviando...
						{:else}
							🔐 Cifrar y Enviar Mensaje
						{/if}
					</button>
				</div>
			</form>

			<div class="security-notice">
				<h4>🛡️ Seguridad del Mensaje</h4>
				<ul>
					<li>Tu mensaje será cifrado usando criptografía de clave pública</li>
					<li>Solo el creador del anuncio puede descifrar tu mensaje</li>
					<li>El mensaje cifrado se almacena de forma segura</li>
					<li>Tu identidad como remitente será registrada</li>
				</ul>
			</div>
		{:else}
			<div class="error-container">
				<h2>Anuncio no encontrado</h2>
				<p>{error || 'El anuncio que buscas no existe o ha sido eliminado.'}</p>
				<button class="btn-primary" on:click={goBack}>
					Volver al Dashboard
				</button>
			</div>
		{/if}
	</div>
{:else}
	<div class="container">
		<div class="error-container">
			<h1>Acceso Denegado</h1>
			<p>Necesitas estar conectado para enviar mensajes.</p>
			<button on:click={() => goto('/')} class="btn-primary">
				Ir al Login
			</button>
		</div>
	</div>
{/if}

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	.page-header {
		margin-bottom: 2rem;
	}

	.page-header h1 {
		color: #1e293b;
		margin-bottom: 0.5rem;
		font-size: 2rem;
	}

	.btn-back {
		background: #6b7280;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		cursor: pointer;
		font-size: 0.875rem;
		margin-bottom: 1rem;
		transition: background-color 0.2s;
	}

	.btn-back:hover {
		background: #4b5563;
	}

	.ad-info {
		background: white;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
		overflow: hidden;
	}

	.ad-preview {
		display: flex;
		gap: 1.5rem;
		padding: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.ad-preview img {
		width: 150px;
		height: 150px;
		object-fit: cover;
		border-radius: 0.5rem;
		flex-shrink: 0;
	}

	.ad-details {
		flex: 1;
	}

	.ad-details h2 {
		color: #1e293b;
		margin-bottom: 0.5rem;
		font-size: 1.5rem;
	}

	.ad-description {
		color: #64748b;
		margin-bottom: 1rem;
		line-height: 1.5;
	}

	.ad-price {
		color: #059669;
		font-weight: 600;
		font-size: 1.2rem;
		margin-bottom: 1rem;
	}

	.ad-meta p {
		color: #6b7280;
		font-size: 0.875rem;
		margin-bottom: 0.25rem;
	}

	.encryption-info {
		padding: 1.5rem;
		background: #f0f9ff;
	}

	.encryption-info h3 {
		color: #0c4a6e;
		margin-bottom: 1rem;
		font-size: 1.1rem;
	}

	.encryption-details p {
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
	}

	.encryption-details code {
		background: #e0f2fe;
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-family: monospace;
		font-size: 0.75rem;
	}

	.encryption-explanation {
		background: #dbeafe;
		padding: 1rem;
		border-radius: 0.5rem;
		margin-top: 1rem;
		border-left: 4px solid #3b82f6;
	}

	.encryption-explanation p {
		color: #1e40af;
		margin: 0;
		font-size: 0.875rem;
		line-height: 1.4;
	}

	.message-form {
		background: white;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		padding: 2rem;
		margin-bottom: 2rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		color: #374151;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.form-group textarea {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #d1d5db;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-family: inherit;
		resize: vertical;
		min-height: 120px;
		transition: border-color 0.2s;
	}

	.form-group textarea:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.form-group small {
		display: block;
		color: #6b7280;
		margin-top: 0.25rem;
		font-size: 0.875rem;
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
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

	.btn-primary:hover:not(:disabled) {
		background: #15803d;
	}

	.btn-primary:disabled {
		background: #9ca3af;
		cursor: not-allowed;
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

	.btn-secondary:hover:not(:disabled) {
		background: #4b5563;
	}

	.btn-secondary:disabled {
		background: #9ca3af;
		cursor: not-allowed;
	}

	.error-message {
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #dc2626;
		padding: 0.75rem;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
	}

	.success-message {
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		color: #16a34a;
		padding: 0.75rem;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
	}

	.security-notice {
		background: white;
		border-radius: 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		padding: 1.5rem;
		border: 1px solid #e5e7eb;
	}

	.security-notice h4 {
		color: #374151;
		margin-bottom: 1rem;
		font-size: 1rem;
	}

	.security-notice ul {
		color: #6b7280;
		padding-left: 1.5rem;
	}

	.security-notice li {
		margin-bottom: 0.5rem;
		line-height: 1.4;
	}

	.error-container {
		text-align: center;
		padding: 3rem 2rem;
		background: white;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.error-container h2 {
		color: #dc2626;
		margin-bottom: 1rem;
	}

	.error-container p {
		color: #6b7280;
		margin-bottom: 2rem;
	}

	@media (max-width: 768px) {
		.ad-preview {
			flex-direction: column;
		}

		.ad-preview img {
			width: 100%;
			height: 200px;
		}

		.form-actions {
			flex-direction: column;
		}
	}
</style>