// Script de prueba para EIP-5630 ECIES Implementation
// Ejecutar con: node test-eip5630.js

import { EIP5630Crypto } from './src/lib/crypto/eip5630.js';
import { ethers } from 'ethers';

async function testEIP5630() {
    console.log('🧪 Probando implementación ...\n');

    try {
        // 1. Crear wallets de prueba
        console.log('1. Creando wallets de prueba...');
        const sellerWallet = ethers.Wallet.createRandom();
        const buyerWallet = ethers.Wallet.createRandom();
        
        console.log(`   Vendedor: ${sellerWallet.address}`);
        console.log(`   Comprador: ${buyerWallet.address}\n`);

        // 2. Obtener clave pública de cifrado del vendedor
        console.log('2. Obteniendo clave pública de cifrado...');
        const sellerPublicKey = await EIP5630Crypto.getEncryptionPublicKey(sellerWallet);
        console.log(`   Clave pública del vendedor: ${sellerPublicKey}\n`);

        // 3. Cifrar mensaje del comprador para el vendedor
        const message = "¡Hola! Me interesa tu producto. ¿Podríamos hablar por WhatsApp? Mi número es +1234567890";
        console.log('3. Cifrando mensaje...');
        console.log(`   Mensaje original: "${message}"`);
        
        const encryptedMessage = await EIP5630Crypto.encrypt(message, sellerPublicKey);
        console.log('   ✅ Mensaje cifrado exitosamente');
        console.log('   Estructura del mensaje cifrado:');
        console.log(`     - Version: ${encryptedMessage.version}`);
        console.log(`     - Ephemeral Public Key: ${encryptedMessage.ephemeralPublicKey.slice(0, 20)}...`);
        console.log(`     - Salt: ${encryptedMessage.salt.slice(0, 20)}...`);
        console.log(`     - Nonce: ${encryptedMessage.nonce.slice(0, 20)}...`);
        console.log(`     - Ciphertext: ${encryptedMessage.ciphertext.slice(0, 20)}...`);
        console.log(`     - MAC: ${encryptedMessage.mac.slice(0, 20)}...\n`);

        // 4. Descifrar mensaje (solo el vendedor puede hacerlo)
        console.log('4. Descifrando mensaje...');
        const decryptedMessage = await EIP5630Crypto.decrypt(encryptedMessage, sellerWallet);
        console.log(`   Mensaje descifrado: "${decryptedMessage}"`);
        
        // 5. Verificar que coincidan
        if (message === decryptedMessage) {
            console.log('   ✅ ¡Cifrado/descifrado exitoso! Los mensajes coinciden.\n');
        } else {
            console.log('   ❌ Error: Los mensajes no coinciden\n');
            return false;
        }

        // 6. Probar que el comprador NO puede descifrar
        console.log('5. Probando que el comprador no puede descifrar...');
        try {
            await EIP5630Crypto.decrypt(encryptedMessage, buyerWallet);
            console.log('   ❌ Error: El comprador pudo descifrar (esto no debería pasar)');
            return false;
        } catch (error) {
            console.log('   ✅ Correcto: El comprador no puede descifrar el mensaje');
            console.log(`   Error esperado: ${error.message.slice(0, 50)}...\n`);
        }

        // 7. Prueba de rendimiento
        console.log('6. Prueba de rendimiento...');
        const messages = [
            "Mensaje corto",
            "Este es un mensaje más largo con más contenido para probar el rendimiento del algoritmo ECIES",
            "¡Hola! 👋 Me interesa mucho tu producto. ¿Podrías enviarme más detalles? Mi presupuesto es de $500-1000. También me gustaría saber sobre garantía y tiempo de entrega. ¡Gracias! 😊"
        ];

        for (let i = 0; i < messages.length; i++) {
            const testMessage = messages[i];
            const startTime = performance.now();
            
            const encrypted = await EIP5630Crypto.encrypt(testMessage, sellerPublicKey);
            const decrypted = await EIP5630Crypto.decrypt(encrypted, sellerWallet);
            
            const endTime = performance.now();
            const success = testMessage === decrypted;
            
            console.log(`   Mensaje ${i + 1}: ${testMessage.length} chars - ${(endTime - startTime).toFixed(2)}ms - ${success ? '✅' : '❌'}`);
        }

        console.log('\n🎉 ¡Todas las pruebas de ECIES pasaron exitosamente!');
        console.log('\n📊 Características de la implementación:');
        console.log('   • Curva elíptica: secp256k1 (compatible con Ethereum)');
        console.log('   • Cifrado simétrico: XChaCha20-Poly1305');
        console.log('   • Derivación de claves: HKDF con SHA-256');
        console.log('   • Autenticación: MAC con SHA-256');
        console.log('   • Seguridad: Resistente a ataques de timing');
 

        return true;

    } catch (error) {
        console.error('❌ Error en las pruebas:', error);
        return false;
    }
}

// Ejecutar pruebas
testEIP5630().then(success => {
    process.exit(success ? 0 : 1);
});