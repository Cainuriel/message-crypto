// Debug script to verify key consistency
import { EIP5630Crypto } from './src/lib/crypto/eip5630.js';

export async function debugKeyConsistency(signer) {
    console.log('🔍 DEBUGGING KEY CONSISTENCY');
    
    try {
        // 1. Obtener clave pública
        console.log('\n1. Getting encryption public key...');
        const publicKey = await EIP5630Crypto.getEncryptionPublicKey(signer);
        console.log('   Public key:', publicKey);
        console.log('   Public key length:', publicKey.length);
        
        // 2. Obtener clave privada
        console.log('\n2. Getting private key...');
        const privateKey = await EIP5630Crypto.getPrivateKeyFromSigner(signer);
        console.log('   Private key length:', privateKey.length);
        console.log('   Private key (hex):', Array.from(privateKey).map(b => b.toString(16).padStart(2, '0')).join(''));
        
        // 3. Verificar que la clave privada corresponde a la clave pública
        console.log('\n3. Verifying key pair consistency...');
        
        // Import secp256k1 to verify
        const { secp256k1 } = await import('@noble/curves/secp256k1');
        const { bytesToHex, hexToBytes } = await import('@noble/ciphers/utils.js');
        
        try {
            const derivedPublicKey = secp256k1.getPublicKey(privateKey, true);
            const derivedPublicKeyHex = bytesToHex(derivedPublicKey);
            
            console.log('   Expected public key (from private):', derivedPublicKeyHex);
            console.log('   Actual public key (from getEncryptionPublicKey):', publicKey);
            
            const match = derivedPublicKeyHex === publicKey || 
                         derivedPublicKeyHex === ('0x' + publicKey) ||
                         derivedPublicKeyHex.slice(2) === publicKey;
                         
            console.log('   🎯 Keys match:', match);
            
            if (!match) {
                console.log('   ❌ PROBLEM FOUND: Public and private keys dont correspond!');
                console.log('   📋 This explains the MAC verification failure');
                
                // Check if signer has _signingKey
                console.log('\n4. Checking signer properties...');
                console.log('   Has _signingKey:', !!signer._signingKey);
                console.log('   Has _signingKey.privateKey:', !!signer._signingKey?.privateKey);
                console.log('   Has _signingKey.publicKey:', !!signer._signingKey?.publicKey);
                console.log('   Signer address:', await signer.getAddress());
                
                if (signer._signingKey) {
                    console.log('   SigningKey private key:', signer._signingKey.privateKey);
                    console.log('   SigningKey public key:', signer._signingKey.publicKey);
                }
            } else {
                console.log('   ✅ Keys are consistent - problem must be elsewhere');
            }
            
        } catch (error) {
            console.log('   ❌ Error verifying keys:', error.message);
        }
        
        return { publicKey, privateKey };
        
    } catch (error) {
        console.error('❌ Error in key debug:', error);
        throw error;
    }
}