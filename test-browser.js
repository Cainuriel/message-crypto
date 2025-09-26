// Prueba simple de la implementación EIP-5630 en navegador
// Para usar en la consola del navegador

import { EIP5630Crypto } from './src/lib/crypto/eip5630.js';

async function testBrowser() {
    console.log('🧪 Probando EIP-5630 en navegador...');
    
    try {
        // Simular clave pública para prueba
        const testPublicKey = '036ca9129a7f2bfae6d9269787fcfb180f8eeb19f170353e961294308c8a8bdaaa';
        const testMessage = 'Hola, este es un mensaje de prueba para EIP-5630';
        
        console.log('Mensaje:', testMessage);
        console.log('Cifrando...');
        
        const encrypted = await EIP5630Crypto.encrypt(testMessage, testPublicKey);
        console.log('✅ Cifrado exitoso:', encrypted);
        
        return encrypted;
    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
}

window.testEIP5630Browser = testBrowser;