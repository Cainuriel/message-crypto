# MessageCrypto - Sistema de Mensajería Cifrada End-to-End

## Descripción

MessageCrypto es una aplicación web desarrollada en SvelteKit que implementa un sistema de mensajería cifrada end-to-end entre compradores y vendedores. Los vendedores crean anuncios y solo ellos pueden descifrar los mensajes que reciben de los compradores interesados.

## Arquitectura del Sistema de Cifrado

### Flujo de Funcionamiento

#### 1. Creación de Anuncio (Vendedor)

Cuando un vendedor crea un anuncio:

1. **Conexión con MetaMask**: El vendedor conecta su wallet MetaMask
2. **Generación de Clave Pública**: El sistema solicita a MetaMask una clave pública de cifrado usando `eth_getEncryptionPublicKey`
3. **Derivación de Clave**: MetaMask deriva una clave pública X25519 desde la clave privada Ethereum del vendedor
4. **Almacenamiento**: La clave pública se almacena en el anuncio en formato base64 (44 caracteres)

```javascript
// Ejemplo de clave pública almacenada
encryptionPublicKey: "cwU4v1WUQlMly3/JH88bnq6OWa3w44vAx2vJgR2nmlU="
```

#### 2. Envío de Mensaje (Comprador)

Cuando un comprador envía un mensaje:

1. **Sin MetaMask Requerido**: El comprador NO necesita MetaMask para cifrar
2. **Generación de Claves Efímeras**: Se genera un par de claves temporales X25519 únicas para este mensaje
3. **Cifrado del Mensaje**: Se usa el algoritmo nacl.box (X25519 + XSalsa20-Poly1305) combinando:
   - Clave pública del vendedor (del anuncio)
   - Clave privada efímera (temporal, se descarta después)
4. **Estructura del Mensaje Cifrado**: Se crea un objeto JSON con:
   - `version`: Identificador del algoritmo usado
   - `nonce`: Número único de 24 bytes para este cifrado
   - `ephemPublicKey`: Clave pública efímera (necesaria para descifrar)
   - `ciphertext`: Mensaje cifrado

```javascript
// Ejemplo de mensaje cifrado
{
  "version": "x25519-xsalsa20-poly1305",
  "nonce": "9s31N0inufskNteBlwTmxzoJ+NL9T2ZW",
  "ephemPublicKey": "+UPmrd3v4m+043EKmNwsx23bG6f34ouDCWktGxOol2E=",
  "ciphertext": "k8XUiqyKeuRwEx+7GyqlRRWLXRncLRavg5Ua"
}
```

#### 3. Descifrado de Mensaje (Vendedor)

Cuando el vendedor quiere leer un mensaje:

1. **Verificación de Identidad**: El sistema verifica que la cuenta activa en MetaMask coincida con el creador del anuncio
2. **Solicitud a MetaMask**: Se envía el objeto cifrado completo a MetaMask usando `eth_decrypt`
3. **Descifrado Interno**: MetaMask usa internamente:
   - Su clave privada (nunca expuesta)
   - La clave pública efímera del mensaje
4. **Resultado**: MetaMask devuelve el mensaje descifrado en texto plano

## Algoritmos Criptográficos Utilizados

### Intercambio de Claves
- **X25519 (Curve25519)**: Para el intercambio seguro de claves
- **Claves de 32 bytes**: Tamaño estándar para X25519
- **Derivación desde Ethereum**: Las claves se derivan de las claves privadas de Ethereum

### Cifrado Simétrico
- **XSalsa20-Poly1305**: Cifrado autenticado de flujo
- **Nonce de 24 bytes**: Número único para cada mensaje
- **MAC integrado**: Verificación automática de integridad con Poly1305

### Seguridad de Claves
- **Claves Efímeras**: Cada mensaje usa claves temporales únicas
- **Forward Secrecy**: Comprometer un mensaje no afecta a otros
- **Claves Privadas Protegidas**: Nunca salen de MetaMask

## Características de Seguridad

### Fortalezas del Sistema

1. **Algoritmos de Grado Militar**
   - X25519 es resistente a ataques de computación cuántica por décadas
   - XSalsa20-Poly1305 es usado por Signal, WhatsApp y otras aplicaciones de alta seguridad

2. **Protección de Claves Privadas**
   - Las claves privadas permanecen siempre en MetaMask
   - No hay código que acceda directamente a las claves privadas
   - MetaMask maneja todo el proceso de descifrado internamente

3. **Forward Secrecy Parcial**
   - Cada mensaje usa claves efímeras únicas
   - Comprometer la clave de un mensaje no afecta a otros mensajes

4. **Autenticación de Mensajes**
   - Poly1305 MAC previene la modificación de mensajes
   - Verificación automática de integridad en cada descifrado

5. **Verificación de Destinatario**
   - Solo el creador del anuncio puede descifrar los mensajes
   - Verificación automática de direcciones Ethereum

### Comparación con Estándares de la Industria

| Aspecto | MessageCrypto | Signal/WhatsApp | Estado |
|---------|---------------|-----------------|--------|
| Intercambio de claves | X25519 | X25519 | Equivalente |
| Cifrado | XSalsa20-Poly1305 | ChaCha20-Poly1305 | Muy similar |
| Forward Secrecy | Parcial | Completo | Mejorable |
| Protección de claves | Completa | Completa | Equivalente |
| Metadata Protection | Básica | Avanzada | Mejorable |

## Arquitectura Técnica

### Tecnologías Principales

- **Frontend**: SvelteKit con JavaScript
- **Criptografía**: TweetNaCl (implementación de NaCl en JavaScript)
- **Wallet Integration**: MetaMask con window.ethereum API
- **Algoritmos**: X25519, XSalsa20, Poly1305
- **Formato**: Base64 para codificación de datos binarios

### Estructura de Archivos

```
src/
├── lib/
│   ├── crypto/
│   │   └── eip5630.js          # Implementación criptográfica principal
│   └── stores/
│       └── ads.js              # Gestión de anuncios y mensajes
├── routes/
│   ├── +page.svelte            # Página principal
│   ├── dashboard/              # Panel de control del usuario
│   └── test/                   # Herramientas de debug
```

### Dependencias Criptográficas

```json
{
  "@metamask/eth-sig-util": "^8.2.0",    // Utilidades MetaMask
  "@noble/curves": "^1.6.0",             // Curvas elípticas
  "@noble/hashes": "^1.5.0",             // Funciones hash
  "tweetnacl": "^1.0.3",                 // Criptografía NaCl
  "tweetnacl-util": "^0.15.1"            // Utilidades NaCl
}
```

## Instalación y Uso

### Requisitos Previos

1. **Node.js** v18 o superior
2. **MetaMask** instalado en el navegador
3. **Cuenta Ethereum** con fondos para transacciones (si aplica)

### Instalación

```bash
# Clonar el repositorio
git clone [repository-url]
cd message-crypto

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

### Uso del Sistema

1. **Conectar MetaMask**: Conecta tu wallet en la aplicación
2. **Crear Anuncio**: Como vendedor, crea un anuncio que generará tu clave pública de cifrado
3. **Enviar Mensaje**: Como comprador, envía mensajes cifrados a los vendedores
4. **Leer Mensajes**: Como vendedor, descifra los mensajes recibidos usando MetaMask

## Consideraciones para Producción

### Mejoras Recomendadas

1. **Protección de Metadatos**
   - Cifrar información del remitente y timestamps
   - Implementar padding para ocultar longitudes de mensajes

2. **Rotación de Claves**
   - Sistema automático de renovación de claves de cifrado
   - Mantener historial para descifrar mensajes antiguos

3. **Forward Secrecy Completo**
   - Implementar Double Ratchet algorithm
   - Renovación automática de claves por sesión

4. **Anti-Replay Protection**
   - Prevenir mensajes duplicados
   - Implementar timestamps criptográficos

5. **Rate Limiting Criptográfico**
   - Proof of Work para prevenir spam
   - Throttling basado en identidad criptográfica

### Auditoría de Seguridad

Para uso en producción se recomienda:

1. **Auditoría Profesional**: Contratación de firma especializada en criptografía
2. **Penetration Testing**: Pruebas de intrusión específicas para sistemas criptográficos
3. **Code Review**: Revisión exhaustiva por expertos en seguridad
4. **Compliance**: Verificación de cumplimiento con estándares como OWASP

## Limitaciones Actuales

1. **Dependencia de MetaMask**: Requiere que los usuarios tengan MetaMask instalado
2. **Metadatos Expuestos**: Información del remitente y timestamps son visibles
3. **Sin Rotación de Claves**: Las claves de cifrado no se renuevan automáticamente
4. **Almacenamiento Local**: Los datos se almacenan en localStorage (no persistente)
5. **Sin Backup de Claves**: No hay sistema de recuperación de claves

## Licencia

Sin licencia

## Autor

Fernando López

## Contacto
 
 cainuriel@gmail.com