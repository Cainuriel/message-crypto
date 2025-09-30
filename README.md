# MessageCrypto - Sistema de Anuncios Clasificados con Mensajería Cifrada

## Descripción

MessageCrypto es una aplicación web desarrollada en SvelteKit que implementa un sistema de anuncios clasificados con mensajería cifrada end-to-end. Los usuarios pueden crear anuncios y recibir mensajes cifrados que solo ellos pueden descifrar usando MetaMask.

## Características Principales

- **Creación de Anuncios**: Los usuarios pueden crear anuncios con imagen, título, descripción y precio
- **Mensajería Cifrada**: Sistema de cifrado usando claves derivadas de firmas de MetaMask
- **Dashboard Completo**: Visualización de anuncios propios y de otros usuarios
- **Persistencia Local**: Los datos se guardan en localStorage del navegador
- **Interface Intuitiva**: Diseño responsivo y fácil de usar

## Arquitectura del Sistema de Cifrado

### Flujo de Funcionamiento

#### 1. Creación de Anuncio

Cuando un usuario crea un anuncio:

1. **Conexión con MetaMask**: El usuario debe estar conectado con MetaMask
2. **Generación de Firma**: Se firma el mensaje `ENCRYPTION_KEY_FOR_ADS_{address}` con MetaMask
3. **Derivación de Claves**: Se deriva un par de claves (pública/privada) usando ethers.js
4. **Almacenamiento**: Se guarda la clave pública en el anuncio y la dirección derivada

```javascript
// Estructura del anuncio
{
  id: "1759259738251",
  title: "iPhone 15 Pro",
  description: "Excelente estado",
  price: "800 EUR",
  creator: "0x4B13Cde86c836482aa358d5632574Ee388329225",
  publicKey: "0x0278083660eadcde0e43d2b70788357d9f87a969e1bfae22f0843101cb6e5cfcb9",
  derivedAddress: "0xf3Bb32c3C53FDC6DaA435EebcA332834f537861E",
  keyId: "enc_simple_4B13Cde8_1759259738251"
}
```

#### 2. Envío de Mensaje Cifrado

Cuando alguien envía un mensaje:

1. **Selección del Anuncio**: Se elige el anuncio al que enviar el mensaje
2. **Cifrado con Clave Pública**: Se usa la clave pública del anuncio para cifrar
3. **Algoritmo XOR**: Implementación simple pero efectiva usando ethers.js
4. **Almacenamiento**: El mensaje cifrado se guarda asociado al anuncio

```javascript
// Estructura del mensaje cifrado
{
  id: "1759259768427",
  adId: "1759259738251",
  sender: "0x...",
  encryptedData: {
    version: "ethers-simple-xor",
    data: "0x75844e36d45c4cd7e6a108eb3a5dfc95c5e2ca1c1a98814315c817756aaf713e05c21e6693064c92a7f0",
    keyRef: "0x30f73e53"
  },
  timestamp: "2025-09-30T19:08:54.151Z"
}
```

#### 3. Descifrado de Mensaje

Cuando el creador del anuncio quiere leer los mensajes:

1. **Verificación de Identidad**: Se verifica que el usuario conectado es el creador del anuncio
2. **Regeneración de Firma**: Se firma nuevamente el mismo mensaje con MetaMask
3. **Derivación de Clave Privada**: Se deriva la misma clave privada usando la firma
4. **Descifrado XOR**: Se aplica el algoritmo XOR inverso para recuperar el texto original
5. **Almacenamiento**: El mensaje descifrado se guarda para evitar descifrar múltiples veces

## Tecnologías Utilizadas

### Frontend
- **SvelteKit**: Framework web moderno para el frontend
- **ethers.js v6**: Librería para interacción con Ethereum y criptografía
- **CSS Moderno**: Estilos responsivos sin dependencias externas

### Criptografía
- **Algoritmo XOR**: Cifrado simétrico simple pero efectivo
- **Derivación de Claves**: Basada en firmas determinísticas de MetaMask
- **Keccak256**: Hash criptográfico para derivación de claves

### Almacenamiento
- **localStorage**: Persistencia local de anuncios y mensajes
- **Estructura JSON**: Formato estándar para intercambio de datos

## APIs del Servidor

### /api/encryption/generate-key-test
- **Método**: POST
- **Función**: Genera par de claves a partir de firma de MetaMask
- **Input**: address, signature
- **Output**: publicKey, derivedAddress, keyId

### /api/encryption/encrypt-simple
- **Método**: POST  
- **Función**: Cifra un mensaje usando clave pública
- **Input**: message, recipientPublicKey
- **Output**: encryptedData con estructura version/data/keyRef

### /api/encryption/decrypt-simple
- **Método**: POST
- **Función**: Descifra un mensaje usando clave privada derivada
- **Input**: encryptedData, address, signature
- **Output**: message descifrado en texto plano

## Características de Seguridad

### Fortalezas del Sistema

1. **Claves Criptográficas Robustas**
   - Derivación determinística desde firmas de MetaMask
   - Uso de Keccak256 para hashing criptográfico
   - Claves de 256 bits para máxima seguridad

2. **Protección de Claves Privadas**
   - Las claves privadas se derivan pero no se exponen al frontend
   - MetaMask maneja las firmas de forma segura
   - Regeneración determinística desde la misma firma

3. **Cifrado por Anuncio**
   - Cada anuncio tiene su par de claves único
   - Los mensajes de diferentes anuncios no están relacionados
   - Aislamiento completo entre conversaciones

4. **Verificación de Identidad**
   - Solo el creador del anuncio puede descifrar mensajes
   - Verificación automática de direcciones Ethereum
   - Protección contra acceso no autorizado

5. **Persistencia Segura**
   - Los mensajes se almacenan cifrados en localStorage
   - Los mensajes descifrados se marcan para evitar re-descifrado
   - Datos protegidos incluso con acceso al navegador

### Limitaciones Conocidas

1. **Almacenamiento Local**: Los datos se pierden si se limpia el navegador
2. **Cifrado XOR Simple**: Más simple que algoritmos como AES o ChaCha20
3. **Sin Forward Secrecy**: Comprometer la clave privada afecta todos los mensajes
4. **Dependencia de MetaMask**: Requiere MetaMask para crear anuncios y descifrar

## Instalación y Desarrollo

### Prerrequisitos

- Node.js 18 o superior
- npm o yarn
- MetaMask instalado en el navegador
- Navegador moderno con soporte para WebCrypto

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/message-crypto.git
cd message-crypto

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

### Estructura del Proyecto

```
src/
├── lib/
│   └── stores/
│       ├── auth.js          # Manejo de autenticación con MetaMask
│       └── ads.js           # Store de anuncios y mensajes
├── routes/
│   ├── +layout.svelte       # Layout principal
│   ├── +page.svelte         # Página de login
│   ├── dashboard/
│   │   ├── +page.svelte     # Dashboard principal
│   │   ├── create/          # Crear anuncio
│   │   ├── ads/[adId]/      # Enviar mensaje
│   │   └── messages/[adId]/ # Ver mensajes
│   ├── api/encryption/      # APIs de cifrado
│   └── test/                # Página de pruebas
└── app.css                  # Estilos globales
```
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

#### Para Crear un Anuncio:
1. Conectar MetaMask en la página principal
2. Ir a "Crear Anuncio" en el dashboard
3. Completar título, descripción, precio e imagen
4. El sistema genera automáticamente las claves de cifrado
5. El anuncio queda publicado y visible para otros usuarios

#### Para Enviar un Mensaje:
1. Navegar al dashboard y ver anuncios de otros usuarios
2. Hacer clic en "Enviar Mensaje Cifrado" en cualquier anuncio
3. Escribir el mensaje (se cifra automáticamente)
4. El mensaje se envía cifrado al creador del anuncio

#### Para Leer Mensajes Recibidos:
1. En el dashboard, ver tus anuncios con contador de mensajes
2. Hacer clic en "Ver Mensajes" de cualquier anuncio tuyo
3. Hacer clic en "Descifrar con MetaMask" para cada mensaje
4. MetaMask solicitará una firma para descifrar
5. El mensaje se muestra en texto plano

## Despliegue en Producción

### Configuración para Netlify

La aplicación requiere modificaciones para funcionar en Netlify debido a las APIs del servidor:

#### Opción 1: Usar Netlify Functions
```bash
# Crear directorio para funciones
mkdir netlify/functions

# Mover lógica de APIs a funciones serverless
```

#### Opción 2: Usar Vercel (Recomendado)
Vercel soporta SvelteKit APIs nativamente:
```bash
npm install -g vercel
vercel
```

#### Opción 3: Adapter Netlify
```bash
npm install @sveltejs/adapter-netlify
```

## Casos de Uso

### Marketplace Descentralizado
- Vendedores publican productos con mensajería privada
- Compradores contactan sin revelar información personal
- Comunicación cifrada para negociaciones

### Servicios Profesionales
- Freelancers ofrecen servicios
- Clientes envían briefings confidenciales
- Protección de propiedad intelectual

### Intercambio P2P
- Trading de criptomonedas o NFTs
- Comunicación segura para acordar términos
- Protección contra intercepción de información

## Limitaciones Actuales

1. **Dependencia de MetaMask**: Requiere MetaMask para crear anuncios y descifrar
2. **Almacenamiento Local**: Los datos se almacenan en localStorage del navegador
3. **Sin Forward Secrecy**: Comprometer la clave afecta todos los mensajes
4. **Cifrado XOR Simple**: Más básico que algoritmos como AES o ChaCha20
5. **Sin Backup de Claves**: No hay sistema de recuperación de claves

## Mejoras Futuras

### Seguridad
- [ ] Implementar Perfect Forward Secrecy
- [ ] Migrar a algoritmos más robustos (AES-GCM, ChaCha20)
- [ ] Sistema de rotación de claves
- [ ] Auditoría de seguridad profesional

### Funcionalidades
- [ ] Base de datos real para persistencia
- [ ] Notificaciones push cifradas
- [ ] Sistema de búsqueda y filtros
- [ ] Soporte para archivos adjuntos
- [ ] Múltiples wallets (WalletConnect, etc.)

## Contribuir

1. Fork el repositorio
2. Crear una rama (`git checkout -b feature/NuevaCaracteristica`)
3. Commit los cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abrir un Pull Request

## Licencia

Licencia MIT - ver [LICENSE](LICENSE) para detalles.

## Autor

Fernando López - cainuriel@gmail.com

---

**Nota**: Este proyecto es educativo. Para producción se recomienda auditoría de seguridad profesional.