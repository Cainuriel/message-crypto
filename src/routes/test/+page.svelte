<script>
	import { onMount } from 'svelte';
	import { ethers } from 'ethers';
	
	let provider = null;
	let signer = null;
	let userAddress = '';
	let isConnected = false;
	let testResults = [];
	let isRunning = false;
	
	// Test data
	let testMessage = 'Hi! I am interested in your ad. Can we talk? - User B (mobile)';
	let publicKey = '';
	let encryptedData = null;
	let decryptedMessage = '';
	
	onMount(async () => {
		// Check if MetaMask is available
		if (typeof window.ethereum !== 'undefined') {
			provider = new ethers.BrowserProvider(window.ethereum);
			addResult('MetaMask detected', 'success');
		} else {
			addResult('MetaMask not found', 'error');
		}
	});
	
	async function connectMetaMask() {
		if (!provider) {
			addResult('No provider available', 'error');
			return;
		}
		
		try {
			addResult('Connecting to MetaMask...', 'info');
			
			// Request account access
			await provider.send('eth_requestAccounts', []);
			signer = await provider.getSigner();
			userAddress = await signer.getAddress();
			isConnected = true;
			
			addResult(`Connected to MetaMask: ${userAddress}`, 'success');
		} catch (error) {
			addResult(`Failed to connect: ${error.message}`, 'error');
		}
	}
	
	async function generateEncryptionKey() {
		if (!signer) {
			addResult('No signer available', 'error');
			return;
		}
		
		try {
			addResult('[USER A] Generating encryption key for real MetaMask user...', 'info');
			addResult(`[USER A] Address: ${userAddress}`, 'info');
			
			// Create signature for key derivation
			const message = `ENCRYPTION_KEY_FOR_ADS_${userAddress}`;
			const signature = await signer.signMessage(message);
			
			addResult('[USER A] Signed message for key derivation', 'info');
			
			// Call simplified API
			const response = await fetch('/api/encryption/generate-key-test', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ address: userAddress, signature })
			});
			
			const result = await response.json();
			
			if (result.success) {
				publicKey = result.publicKey;
				addResult(`[USER A] Key generated (${result.method}): ${result.keyId}`, 'success');
				addResult(`[USER A] Public key: ${publicKey.substring(0, 30)}...`, 'info');
				addResult(`[USER A] Derived address: ${result.derivedAddress}`, 'info');
				addResult('[USER A] This public key can now be used by others to send encrypted messages!', 'success');
			} else {
				addResult(`[USER A] Key generation failed: ${result.error}`, 'error');
			}
		} catch (error) {
			addResult(`Error generating key: ${error.message}`, 'error');
		}
	}
	
	async function encryptMessage() {
		if (!publicKey) {
			addResult('No public key available from User A', 'error');
			return;
		}
		
		try {
			// Simulate User B (mock user) encrypting a message for User A
			addResult('[USER B - MOCK] Simulating another user encrypting message...', 'info');
			addResult('[USER B - MOCK] Mock user address: 0x742d35Cc6635C0532925a3b8D400E1f9B7e6F991', 'info');
			addResult(`[USER B - MOCK] Message to encrypt: "${testMessage}"`, 'info');
			addResult('[USER B - MOCK] Encrypting FOR User A using their public key', 'info');
			
			// Call simplified encrypt API (User B encrypts for User A)
			const response = await fetch('/api/encryption/encrypt-simple', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					message: testMessage, 
					recipientPublicKey: publicKey // User A's public key
				})
			});
			
			const result = await response.json();
			
			if (result.success) {
				encryptedData = result.encryptedData;
				addResult(`[USER B - MOCK] Message encrypted successfully (${result.method})`, 'success');
				addResult(`[USER B - MOCK] Format: ${encryptedData.version}`, 'info');
				addResult(`[USER B - MOCK] Encrypted data: ${encryptedData.data.substring(0, 30)}...`, 'info');
				addResult('[USER B - MOCK] Message sent to User A inbox!', 'success');
			} else {
				addResult(`[USER B - MOCK] Encryption failed: ${result.error}`, 'error');
			}
		} catch (error) {
			addResult(`[USER B - MOCK] Error encrypting: ${error.message}`, 'error');
		}
	}
	
	async function decryptMessage() {
		if (!encryptedData || !signer) {
			addResult('No encrypted data or signer available', 'error');
			return;
		}
		
		try {
			addResult('[USER A] Attempting to decrypt message from User B...', 'info');
			addResult('[USER A] Signing with MetaMask to derive decryption key...', 'info');
			
			// Create signature for key derivation (User A signs with their MetaMask)
			const message = `ENCRYPTION_KEY_FOR_ADS_${userAddress}`;
			const signature = await signer.signMessage(message);
			
			addResult('[USER A] Successfully signed with MetaMask', 'info');
			
			// Call simplified decrypt API (User A decrypts User B's message)
			const response = await fetch('/api/encryption/decrypt-simple', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					encryptedData: encryptedData, 
					address: userAddress, 
					signature: signature 
				})
			});
			
			const result = await response.json();
			
			if (result.success) {
				decryptedMessage = result.message;
				addResult(`[USER A] Message decrypted successfully (${result.method})`, 'success');
				addResult(`[USER A] Decrypted message: "${decryptedMessage}"`, 'success');
				addResult('[USER A] Message was from User B: 0x742d35Cc...', 'info');
				
				// Verify the message matches
				if (decryptedMessage === testMessage) {
					addResult('CROSS-USER ENCRYPTION TEST PASSED!', 'success');
					addResult('User B to User A encryption/decryption works perfectly!', 'success');
				} else {
					addResult('Message mismatch - test FAILED!', 'error');
				}
			} else {
				addResult(`[USER A] Decryption failed: ${result.error}`, 'error');
			}
		} catch (error) {
			addResult(`[USER A] Error decrypting: ${error.message}`, 'error');
		}
	}
	
	async function runFullTest() {
		if (isRunning) return;
		
		isRunning = true;
		testResults = [];
		publicKey = '';
		encryptedData = null;
		decryptedMessage = '';
		
		addResult('Starting CROSS-USER encryption test (User B to User A)...', 'info');
		addResult('Test scenario: User B encrypts message for User A, User A decrypts', 'info');
		
		try {
			if (!isConnected) {
				await connectMetaMask();
				if (!isConnected) return;
			}
			
			addResult('Step 1: User A (MetaMask) generates encryption key...', 'info');
			await new Promise(resolve => setTimeout(resolve, 1000));
			await generateEncryptionKey();
			
			addResult('Step 2: User B (Mock) encrypts message for User A...', 'info');
			await new Promise(resolve => setTimeout(resolve, 1000));
			await encryptMessage();
			
			addResult('Step 3: User A (MetaMask) decrypts User B message...', 'info');
			await new Promise(resolve => setTimeout(resolve, 1000));
			await decryptMessage();
			
			addResult('Cross-user encryption test sequence completed!', 'success');
		} catch (error) {
			addResult(`Test failed: ${error.message}`, 'error');
		} finally {
			isRunning = false;
		}
	}
	
	function addResult(message, type) {
		testResults = [...testResults, {
			message,
			type,
			timestamp: new Date().toLocaleTimeString()
		}];
	}
	
	function clearResults() {
		testResults = [];
		publicKey = '';
		encryptedData = null;
		decryptedMessage = '';
	}
</script>

<svelte:head>
	<title>Cross-User Encryption Test</title>
</svelte:head>

<div class="container">
	<h1>Cross-User Encryption Test</h1>
	<p class="subtitle">Testing User B to User A encryption flow (Real-world scenario)</p>
	
	<div class="status-section">
		<div class="status {isConnected ? 'connected' : 'disconnected'}">
			{#if isConnected}
				Connected: {userAddress.substring(0, 6)}...{userAddress.substring(-4)}
			{:else}
				Not connected
			{/if}
		</div>
	</div>
	
	<div class="controls">
		{#if !isConnected}
			<button on:click={connectMetaMask} class="primary">
				Connect MetaMask
			</button>
		{:else}
			<button on:click={runFullTest} disabled={isRunning} class="primary">
				{#if isRunning}
					Running Cross-User Test...
				{:else}
					Run Cross-User Test
				{/if}
			</button>
		{/if}
		
		<button on:click={clearResults} class="secondary">
			Clear Results
		</button>
	</div>
	
	<div class="individual-tests">
		<h3>Individual Tests:</h3>
		<div class="test-buttons">
			<button on:click={generateEncryptionKey} disabled={!isConnected} class="test-btn">
				User A: Generate Key
			</button>
			<button on:click={encryptMessage} disabled={!publicKey} class="test-btn">
				User B: Encrypt Message
			</button>
			<button on:click={decryptMessage} disabled={!encryptedData} class="test-btn">
				User A: Decrypt Message
			</button>
		</div>
	</div>
	
	<div class="test-data">
		<div class="data-item">
			<strong>Test Message:</strong>
			<input bind:value={testMessage} placeholder="Enter message to encrypt" />
		</div>
		
		{#if publicKey}
			<div class="data-item">
				<strong>Public Key (User A):</strong>
				<code>{publicKey}</code>
			</div>
		{/if}
		
		{#if encryptedData}
			<div class="data-item">
				<strong>Encrypted Data (From User B):</strong>
				<details>
					<summary>Show encrypted data structure</summary>
					<pre>{JSON.stringify(encryptedData, null, 2)}</pre>
				</details>
			</div>
		{/if}
		
		{#if decryptedMessage}
			<div class="data-item">
				<strong>Decrypted Message (User A reads):</strong>
				<code class="success">{decryptedMessage}</code>
			</div>
		{/if}
	</div>
	
	<div class="results">
		<h3>Test Results:</h3>
		{#if testResults.length === 0}
			<p class="no-results">No test results yet. Run a test to see output.</p>
		{:else}
			<div class="results-list">
				{#each testResults as result}
					<div class="result-item {result.type}">
						<span class="timestamp">{result.timestamp}</span>
						<span class="message">{result.message}</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}
	
	h1 {
		color: #16a34a;
		text-align: center;
		margin-bottom: 0.5rem;
	}
	
	.subtitle {
		text-align: center;
		color: #6b7280;
		margin-bottom: 2rem;
	}
	
	.status-section {
		text-align: center;
		margin-bottom: 2rem;
	}
	
	.status {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		font-weight: 600;
	}
	
	.status.connected {
		background: #dcfce7;
		color: #166534;
		border: 1px solid #bbf7d0;
	}
	
	.status.disconnected {
		background: #fef2f2;
		color: #dc2626;
		border: 1px solid #fecaca;
	}
	
	.controls {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-bottom: 2rem;
	}
	
	.individual-tests {
		margin-bottom: 2rem;
	}
	
	.individual-tests h3 {
		margin-bottom: 1rem;
		color: #374151;
	}
	
	.test-buttons {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	
	.test-btn {
		padding: 0.5rem 1rem;
		border: 1px solid #d1d5db;
		background: white;
		border-radius: 0.375rem;
		cursor: pointer;
		font-size: 0.875rem;
	}
	
	.test-btn:hover:not(:disabled) {
		background: #f9fafb;
	}
	
	.test-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	button {
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		font-weight: 600;
		cursor: pointer;
		border: none;
		transition: all 0.2s;
	}
	
	button.primary {
		background: #16a34a;
		color: white;
	}
	
	button.primary:hover:not(:disabled) {
		background: #15803d;
	}
	
	button.secondary {
		background: #6b7280;
		color: white;
	}
	
	button.secondary:hover {
		background: #4b5563;
	}
	
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.test-data {
		margin-bottom: 2rem;
	}
	
	.data-item {
		margin-bottom: 1rem;
		padding: 1rem;
		background: #f9fafb;
		border-radius: 0.5rem;
		border: 1px solid #e5e7eb;
	}
	
	.data-item strong {
		display: block;
		margin-bottom: 0.5rem;
		color: #374151;
	}
	
	.data-item input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
	}
	
	.data-item code {
		background: #f3f4f6;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-family: 'Monaco', 'Courier New', monospace;
		font-size: 0.875rem;
		word-break: break-all;
	}
	
	.data-item code.success {
		background: #dcfce7;
		color: #166534;
	}
	
	.data-item pre {
		background: #1f2937;
		color: #e5e7eb;
		padding: 1rem;
		border-radius: 0.375rem;
		overflow-x: auto;
		font-size: 0.75rem;
	}
	
	.results {
		border-top: 2px solid #e5e7eb;
		padding-top: 2rem;
	}
	
	.results h3 {
		margin-bottom: 1rem;
		color: #374151;
	}
	
	.no-results {
		color: #6b7280;
		font-style: italic;
		text-align: center;
		padding: 2rem;
	}
	
	.results-list {
		max-height: 400px;
		overflow-y: auto;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
	}
	
	.result-item {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid #f3f4f6;
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	
	.result-item:last-child {
		border-bottom: none;
	}
	
	.result-item.success {
		background: #f0fdf4;
		border-left: 4px solid #22c55e;
	}
	
	.result-item.error {
		background: #fef2f2;
		border-left: 4px solid #ef4444;
	}
	
	.result-item.info {
		background: #eff6ff;
		border-left: 4px solid #3b82f6;
	}
	
	.timestamp {
		font-size: 0.75rem;
		color: #6b7280;
		min-width: 80px;
	}
	
	.message {
		flex: 1;
		font-family: 'Monaco', 'Courier New', monospace;
		font-size: 0.875rem;
	}
</style>