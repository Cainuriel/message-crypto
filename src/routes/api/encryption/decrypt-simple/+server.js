import { json } from '@sveltejs/kit';
import { ethers } from 'ethers';

/**
 * Simple decryption using ethers.js - reverse of encryption
 */
function decryptWithEthers(encryptedData, privateKey) {
    try {
        console.log(`🔧 [DECRYPT] Starting decryption...`);
        console.log(`🔧 [DECRYPT] encryptedData:`, encryptedData);
        console.log(`🔧 [DECRYPT] privateKey type:`, typeof privateKey);
        
        // Derive the same key used for encryption
        const wallet = new ethers.Wallet(privateKey);
        const keyHash = ethers.keccak256(wallet.signingKey.compressedPublicKey);
        
        console.log(`🔧 [DECRYPT] keyHash:`, keyHash);
        console.log(`🔧 [DECRYPT] encryptedData.data:`, encryptedData.data);
        console.log(`🔧 [DECRYPT] encryptedData.data type:`, typeof encryptedData.data);
        
        // Decrypt using XOR (reverse of encryption)
        const keyBytes = ethers.getBytes(keyHash);
        console.log(`🔧 [DECRYPT] keyBytes length:`, keyBytes.length);
        
        const encryptedBytes = ethers.getBytes(encryptedData.data);
        console.log(`🔧 [DECRYPT] encryptedBytes length:`, encryptedBytes.length);
        
        const decrypted = new Uint8Array(encryptedBytes.length);
        
        for (let i = 0; i < encryptedBytes.length; i++) {
            decrypted[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
        }
        
        const result = ethers.toUtf8String(decrypted);
        console.log(`🔧 [DECRYPT] Decryption successful:`, result);
        return result;
    } catch (error) {
        console.error(`🔧 [DECRYPT] Decryption error:`, error);
        throw new Error(`Decryption failed: ${error.message}`);
    }
}

/**
 * Derives encryption key pair from signature
 */
function deriveEncryptionKeyFromSignature(signature) {
    const seed = ethers.keccak256(signature);
    const wallet = new ethers.Wallet(seed);
    return {
        address: wallet.address,
        publicKey: wallet.signingKey.compressedPublicKey,
        privateKey: wallet.privateKey
    };
}

export async function POST({ request }) {
    try {
        const { encryptedData, address, signature } = await request.json();
        
        // Validate input
        if (!encryptedData || !address || !signature) {
            return json(
                { success: false, error: 'encryptedData, address, and signature are required' },
                { status: 400 }
            );
        }
        
        // Validate address format
        if (!ethers.isAddress(address)) {
            return json(
                { success: false, error: 'Invalid Ethereum address' },
                { status: 400 }
            );
        }
        
        // Validate encrypted data format
        if (!encryptedData || typeof encryptedData !== 'object') {
            return json(
                { success: false, error: 'Invalid encrypted data format - must be object' },
                { status: 400 }
            );
        }
        
        if (!encryptedData.version) {
            return json(
                { success: false, error: 'Invalid encrypted data format - missing version' },
                { status: 400 }
            );
        }
        
        if (!encryptedData.data) {
            return json(
                { success: false, error: 'Invalid encrypted data format - missing data' },
                { status: 400 }
            );
        }
        
        console.log(`🔓 [SIMPLE] Decrypting message for address: ${address}`);
        console.log(`📦 [SIMPLE] Encrypted data version: ${encryptedData.version}`);
        console.log(`🔍 [SIMPLE] Encrypted data.data type: ${typeof encryptedData.data}`);
        console.log(`🔍 [SIMPLE] Encrypted data.data value:`, encryptedData.data);
        console.log(`🔍 [SIMPLE] Full encrypted data:`, encryptedData);
        
        // Derive encryption key from signature
        const derivedKey = deriveEncryptionKeyFromSignature(signature);
        
        // Decrypt the message
        const decryptedMessage = decryptWithEthers(encryptedData, derivedKey.privateKey);
        
        console.log(`✅ [SIMPLE] Message decrypted successfully`);
        console.log(`📝 [SIMPLE] Decrypted length: ${decryptedMessage.length} characters`);
        
        return json({
            success: true,
            message: decryptedMessage,
            timestamp: Date.now(),
            method: 'ethers-simple'
        });
        
    } catch (error) {
        console.error('❌ Error decrypting message:', error);
        return json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}