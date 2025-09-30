<script>
	import { isConnected, userAddress, signer } from '$lib/stores/auth.js';
	import { createAd } from '$lib/stores/ads.js';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	// Redirect only on client side
	onMount(() => {
		if (browser && !$isConnected) {
			goto('/');
		}
	});

	let title = '';
	let description = '';
	let price = '';
	let imageFile = null;
	let imagePreview = '';
	let loading = false;
	let error = '';
	let success = '';

	function handleImageUpload(event) {
		const file = event.target.files[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) { // 5MB limit
				error = 'La imagen no puede superar los 5MB';
				return;
			}

			imageFile = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreview = e.target.result;
			};
			reader.readAsDataURL(file);
			error = '';
		}
	}

	async function handleSubmit() {
		if (!title.trim() || !description.trim()) {
			error = 'Por favor completa todos los campos obligatorios';
			return;
		}

		if (!imageFile) {
			error = 'Por favor selecciona una imagen';
			return;
		}

		if (!$signer) {
			error = 'No hay conexión con MetaMask';
			return;
		}

		loading = true;
		error = '';
		success = '';

		try {
			console.log('Creando anuncio...');
			
			const result = await createAd({
				title: title.trim(),
				description: description.trim(),
				price: price.trim()
			}, imageFile, $userAddress, $signer);

			if (result.success) {
				success = 'Anuncio creado exitosamente con clave de encriptación!';
				console.log('Anuncio creado:', result.ad);
				
				// Limpiar formulario
				title = '';
				description = '';
				price = '';
				imageFile = null;
				imagePreview = '';
				
				// Redirigir después de un momento
				setTimeout(() => {
					goto('/dashboard');
				}, 2000);
			} else {
				error = result.error;
			}
		} catch (err) {
			console.error('Error creando anuncio:', err);
			error = 'Error inesperado: ' + err.message;
		} finally {
			loading = false;
		}
	}

	function goBack() {
		goto('/dashboard');
	}
</script>

<svelte:head>
	<title>Crear Anuncio - MessageCrypto</title>
</svelte:head>

{#if $isConnected}
	<div class="container">
		<header class="page-header">
			<button class="back-btn" on:click={goBack}>
				← Volver al Dashboard
			</button>
			<h1>Crear Nuevo Anuncio</h1>
			<p>Los mensajes se cifrarán automáticamente con tu clave de MetaMask</p>
		</header>

		<div class="form-container">
			<form on:submit|preventDefault={handleSubmit} class="ad-form">
				
				{#if error}
					<div class="message error">{error}</div>
				{/if}
				
				{#if success}
					<div class="message success">{success}</div>
				{/if}

				<div class="form-section">
					<h2>Información del Anuncio</h2>

					<div class="input-group">
						<label for="title">Título del Anuncio *</label>
						<input
							id="title"
							type="text"
							bind:value={title}
							placeholder="Ej: iPhone 15 Pro Max como nuevo"
							maxlength="100"
							disabled={loading}
							required
						/>
						<small>{title.length}/100 caracteres</small>
					</div>

					<div class="input-group">
						<label for="description">Descripción *</label>
						<textarea
							id="description"
							bind:value={description}
							placeholder="Describe tu artículo en detalle..."
							maxlength="500"
							rows="6"
							disabled={loading}
							required
						></textarea>
						<small>{description.length}/500 caracteres</small>
					</div>

					<div class="input-group">
						<label for="price">Precio (opcional)</label>
						<input
							id="price"
							type="text"
							bind:value={price}
							placeholder="Ej: €500, Negociable, A consultar"
							maxlength="50"
							disabled={loading}
						/>
					</div>
				</div>

				<div class="form-section">
					<h2>Imagen del Artículo</h2>
					
					<div class="input-group">
						<label for="image">Seleccionar Imagen *</label>
						<input
							id="image"
							type="file"
							accept="image/*"
							on:change={handleImageUpload}
							disabled={loading}
							required
						/>
						<small>Máximo 5MB - JPG, PNG, WebP</small>
					</div>

					{#if imagePreview}
						<div class="image-preview">
							<h3>Vista previa:</h3>
							<img src={imagePreview} alt="Vista previa" />
						</div>
					{/if}
				</div>

				<div class="form-section encryption-info">
					<h2>Seguridad y Encriptación</h2>
					<div class="info-box">
						<p><strong>Cómo funciona:</strong></p>
						<ol>
							<li>Se generará automáticamente una id de encriptación vinculada a tu MetaMask</li>
							<li>Los interesados podrán enviarte mensajes cifrados</li>
							<li>Solo tú podrás descifrar los mensajes firmando con tu MetaMask</li>
						</ol>
						<p><strong>Dirección del creador:</strong> {$userAddress}</p>
					</div>
				</div>

				<div class="form-actions">
					<button type="button" on:click={goBack} class="btn-secondary" disabled={loading}>
						Cancelar
					</button>
					<button type="submit" class="btn-primary" disabled={loading || !title.trim() || !description.trim() || !imageFile}>
						{#if loading}
							Creando anuncio...
						{:else}
							Crear Anuncio
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{:else}
	<div class="container">
		<div class="error-container">
			<h1>Acceso Denegado</h1>
			<p>Necesitas estar conectado para crear anuncios.</p>
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
		text-align: center;
		margin-bottom: 3rem;
	}

	.page-header h1 {
		color: #1e293b;
		margin: 1rem 0 0.5rem 0;
		font-size: 2.5rem;
	}

	.page-header p {
		color: #64748b;
		font-size: 1.1rem;
	}

	.back-btn {
		background: #6b7280;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		cursor: pointer;
		margin-bottom: 1rem;
		font-size: 0.875rem;
	}

	.back-btn:hover {
		background: #4b5563;
	}

	.form-container {
		background: white;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		padding: 2rem;
	}

	.ad-form {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.form-section {
		border-bottom: 1px solid #e5e7eb;
		padding-bottom: 2rem;
	}

	.form-section:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.form-section h2 {
		color: #374151;
		margin-bottom: 1.5rem;
		font-size: 1.25rem;
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

	.input-group input,
	.input-group textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.5rem;
		font-size: 1rem;
		transition: border-color 0.2s;
	}

	.input-group input:focus,
	.input-group textarea:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.input-group input:disabled,
	.input-group textarea:disabled {
		background-color: #f9fafb;
		color: #6b7280;
	}

	.input-group small {
		display: block;
		margin-top: 0.25rem;
		color: #6b7280;
		font-size: 0.875rem;
	}

	.image-preview {
		margin-top: 1rem;
		text-align: center;
	}

	.image-preview h3 {
		margin-bottom: 0.5rem;
		color: #374151;
	}

	.image-preview img {
		max-width: 300px;
		max-height: 200px;
		border-radius: 0.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.encryption-info {
		background: #f0f9ff;
		padding: 1.5rem;
		border-radius: 0.5rem;
		border: 1px solid #e0f2fe;
	}

	.info-box {
		color: #0c4a6e;
	}

	.info-box p {
		margin-bottom: 0.5rem;
	}

	.info-box ol {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	.info-box li {
		margin-bottom: 0.5rem;
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		padding-top: 1rem;
	}

	.btn-primary {
		background: #16a34a;
		color: white;
		border: none;
		padding: 0.75rem 2rem;
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
		background: #94a3b8;
		cursor: not-allowed;
	}

	.btn-secondary {
		background: #6b7280;
		color: white;
		border: none;
		padding: 0.75rem 2rem;
		border-radius: 0.5rem;
		cursor: pointer;
		font-size: 1rem;
		transition: background-color 0.2s;
	}

	.btn-secondary:hover:not(:disabled) {
		background: #4b5563;
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
</style>