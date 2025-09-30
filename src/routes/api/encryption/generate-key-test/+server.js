import { json } from '@sveltejs/kit';
import { ethers } from 'ethers';

/**
 * Derives encryption key pair from Ethereum signature using only ethers.js
 */
function deriveEncryptionKeyFromSignature(signature) {
    try {
        // Hash the signature to get a seed
        const seed = ethers.keccak256(signature);
        
        // Create a wallet from the seed (this gives us a key pair)
        const wallet = new ethers.Wallet(seed);
        
        // Get the compressed public key (this is standard)
        const publicKey = wallet.signingKey.compressedPublicKey;
        
        return {
            address: wallet.address,
            publicKey: publicKey,
            privateKey: wallet.privateKey
        };
    } catch (error) {
        throw new Error(`Key derivation failed: ${error.message}`);
    }
}

export async function POST({ request }) {
    try {
        const { address, signature } = await request.json();
        
        // Validate input
        if (!address || !signature) {
            return json(
                { success: false, error: 'Address and signature are required' },
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
        
        console.log(`🔑 [SIMPLE] Generating encryption key for address: ${address}`);
        
        // Derive encryption key from signature using only ethers.js
        const derivedKey = deriveEncryptionKeyFromSignature(signature);
        
        console.log(`🔍 [DEBUG] Derived key structure:`, derivedKey);
        console.log(`🔍 [DEBUG] Has publicKey:`, !!derivedKey.publicKey);
        console.log(`🔍 [DEBUG] PublicKey value:`, derivedKey.publicKey);
        
        // Generate key ID for reference
        const keyId = `enc_simple_${address.slice(2, 10)}_${Date.now()}`;
        
        console.log(`✅ [SIMPLE] Encryption key generated: ${keyId}`);
        console.log(`🔑 [SIMPLE] Derived address: ${derivedKey.address}`);
        
        return json({
            success: true,
            publicKey: derivedKey.publicKey,
            derivedAddress: derivedKey.address,
            keyId: keyId,
            address: address,
            method: 'ethers-only'
        });
        
    } catch (error) {
        console.error('❌ Error generating encryption key:', error);
        return json(
            { success: false, error: error.message, stack: error.stack },
            { status: 500 }
        );
    }
}