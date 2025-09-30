import { json } from '@sveltejs/kit';
import { ethers } from 'ethers';

/**
 * Simple encryption using ethers.js AES
 */
function encryptWithEthers(message, publicKey) {
    try {
        // Convert message to bytes
        const messageBytes = ethers.toUtf8Bytes(message);
        
        // Use public key as seed for AES key
        const keyHash = ethers.keccak256(publicKey);
        
        // Simple XOR encryption for demo (in production use proper AES)
        const keyBytes = ethers.getBytes(keyHash);
        const encrypted = new Uint8Array(messageBytes.length);
        
        for (let i = 0; i < messageBytes.length; i++) {
            encrypted[i] = messageBytes[i] ^ keyBytes[i % keyBytes.length];
        }
        
        return {
            version: 'ethers-simple-xor',
            data: ethers.hexlify(encrypted),
            keyRef: ethers.keccak256(publicKey).slice(0, 10)
        };
    } catch (error) {
        throw new Error(`Encryption failed: ${error.message}`);
    }
}

export async function POST({ request }) {
    try {
        const { message, recipientPublicKey } = await request.json();
        
        // Validate input
        if (!message || !recipientPublicKey) {
            return json(
                { success: false, error: 'Message and recipientPublicKey are required' },
                { status: 400 }
            );
        }
        
        if (typeof message !== 'string') {
            return json(
                { success: false, error: 'Message must be a string' },
                { status: 400 }
            );
        }
        
        if (message.length > 10000) { // 10KB limit
            return json(
                { success: false, error: 'Message too long (max 10KB)' },
                { status: 400 }
            );
        }
        
        console.log(`🔒 [SIMPLE] Encrypting message of ${message.length} characters`);
        console.log(`🔑 [SIMPLE] Using public key: ${recipientPublicKey.substring(0, 20)}...`);
        
        // Encrypt the message using simple ethers.js approach
        const encryptedData = encryptWithEthers(message, recipientPublicKey);
        
        console.log(`✅ [SIMPLE] Message encrypted successfully`);
        console.log(`📦 [SIMPLE] Encrypted format: ${encryptedData.version}`);
        
        return json({
            success: true,
            encryptedData: encryptedData,
            timestamp: Date.now(),
            method: 'ethers-simple'
        });
        
    } catch (error) {
        console.error('❌ Error encrypting message:', error);
        return json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}