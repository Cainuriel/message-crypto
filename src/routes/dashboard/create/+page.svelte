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

		loading = true;
		error = '';

		try {
			const result = await createAd({
				title,
				description,
				price,
				creator: $userAddress
			}, imageFile, $signer);

			if (result.success) {
				alert('¡Anuncio creado exitosamente! Los mensajes se cifrarán automáticamente con tu clave pública.');
				goto('/dashboard');
			} else {
				error = result.error;
			}
		} catch (err) {
			error = 'Error al crear el anuncio: ' + err.message;
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
		<header>
			<button class="back-btn" on:click={goBack}>← Volver al Dashboard</button>
			<h1>📝 Crear Nuevo Anuncio</h1>
		</header>

		<form on:submit|preventDefault={handleSubmit}>
			<div class="form-section">
				<h2>Información del Anuncio</h2>

				<div class="input-group">
					<label for="title">Título del Anuncio *</label>
					<input
						id="title"
						type="text"
						bind:value={title}
						placeholder="Ej: iPhone 14 Pro usado"
						disabled={loading}
						required
					/>
				</div>

				<div class="input-group">
					<label for="description">Descripción *</label>
					<textarea
						id="description"
						bind:value={description}
						placeholder="Describe tu producto o servicio..."
						rows="4"
						disabled={loading}
						required
					></textarea>
				</div>

				<div class="input-group">
					<label for="price">Precio (opcional)</label>
					<input
						id="price"
						type="text"
						bind:value={price}
						placeholder="Ej: $500 USD, 0.1 ETH, Negociable"
						disabled={loading}
					/>
				</div>
			</div>

			<div class="form-section">
				<h2>Imagen del Producto</h2>

				<div class="image-upload">
					<input
						type="file"
						id="image"
						accept="image/*"
						on:change={handleImageUpload}
						disabled={loading}
						style="display: none;"
					/>

					{#if imagePreview}
						<div class="image-preview">
							<img src={imagePreview} alt="Vista previa" />
							<button type="button" on:click={() => document.getElementById('image').click()}>
								Cambiar Imagen
							</button>
						</div>
					{:else}
						<label for="image" class="upload-area">
							<div class="upload-content">
								<span class="upload-icon">📷</span>
								<span>Haz clic para subir una imagen</span>
								<span class="upload-hint">PNG, JPG hasta 5MB</span>
							</div>
						</label>
					{/if}
				</div>
			</div>

			<div class="form-section">
				<h2>🔐 Cifrado Automático</h2>
				<p class="section-description">
					Los mensajes se cifrarán automáticamente usando tu clave pública de Ethereum. Solo tú podrás descifrarlos con tu MetaMask.
				</p>
				<div class="crypto-info">
					<div class="crypto-feature">
						<span class="crypto-icon">🔑</span>
						<div>
							<strong>Cifrado asimétrico</strong>
							<p>Los compradores cifran mensajes con tu clave pública</p>
						</div>
					</div>
					<div class="crypto-feature">
						<span class="crypto-icon">🔒</span>
						<div>
							<strong>Descifrado seguro</strong>
							<p>Solo tú puedes descifrar con tu MetaMask</p>
						</div>
					</div>
				</div>
			</div>

			{#if error}
				<div class="error">{error}</div>
			{/if}

			<div class="form-actions">
				<button type="button" on:click={goBack} disabled={loading}>
					Cancelar
				</button>
				<button type="submit" disabled={loading || !title.trim() || !description.trim() || !imageFile}>
					{loading ? 'Creando...' : 'Crear Anuncio'}
				</button>
			</div>
		</form>
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

	form {
		max-width: 800px;
		margin: 0 auto;
	}

	.form-section {
		background: white;
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
	}

	.form-section h2 {
		color: #1e293b;
		margin-bottom: 1rem;
		font-size: 1.25rem;
	}

	.section-description {
		color: #64748b;
		margin-bottom: 1.5rem;
		line-height: 1.6;
	}

	.input-group {
		margin-bottom: 1.5rem;
	}

	label {
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

	.image-upload {
		margin-bottom: 1rem;
	}

	.upload-area {
		display: block;
		width: 100%;
		min-height: 200px;
		border: 2px dashed #d1d5db;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.upload-area:hover {
		border-color: #3b82f6;
		background: #f8fafc;
	}

	.upload-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 200px;
		color: #6b7280;
	}

	.upload-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.upload-hint {
		font-size: 0.875rem;
		color: #9ca3af;
		margin-top: 0.5rem;
	}

	.image-preview {
		text-align: center;
	}

	.image-preview img {
		max-width: 100%;
		max-height: 300px;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		margin-top: 2rem;
	}

	.form-actions button[type="button"] {
		background: #6b7280;
	}

	.form-actions button[type="button"]:hover {
		background: #4b5563;
	}

	.crypto-info {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.crypto-feature {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: #f0f9ff;
		border: 1px solid #bae6fd;
		border-radius: 0.5rem;
	}

	.crypto-icon {
		font-size: 1.5rem;
		min-width: 2rem;
	}

	.crypto-feature div {
		flex: 1;
	}

	.crypto-feature strong {
		color: #1e40af;
		display: block;
		margin-bottom: 0.25rem;
	}

	.crypto-feature p {
		color: #64748b;
		font-size: 0.875rem;
		margin: 0;
	}
</style>