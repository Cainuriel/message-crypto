================
CODE SNIPPETS
================
TITLE: Performing XChaCha20-Poly1305 Encryption and Decryption (JavaScript)
DESCRIPTION: This example demonstrates how to encrypt and decrypt data using the XChaCha20-Poly1305 authenticated encryption algorithm. It shows how to generate a random key and nonce, convert data to bytes, encrypt the plaintext, and then decrypt the ciphertext back to its original form. It emphasizes the importance of using a different nonce for each encryption operation.

SOURCE: https://github.com/paulmillr/noble-ciphers/blob/main/README.md#_snippet_1

LANGUAGE: JavaScript
CODE:
```
import { xchacha20poly1305 } from '@noble/ciphers/chacha.js';
import { utf8ToBytes } from '@noble/ciphers/utils.js';
import { randomBytes } from '@noble/ciphers/webcrypto.js';
const key = randomBytes(32); // random key
// const key = new Uint8Array([ // existing key
//   169, 88, 160, 139, 168, 29, 147, 196, 14, 88, 237, 76, 243, 177, 109, 140,
//   195, 140, 80, 10, 216, 134, 215, 71, 191, 48, 20, 104, 189, 37, 38, 55,
// ]);
// import { hexToBytes } from '@noble/ciphers/utils.js'; // hex key
// const key = hexToBytes('4b7f89bac90a1086fef73f5da2cbe93b2fae9dfbf7678ae1f3e75fd118ddf999');
const nonce = randomBytes(24);
const chacha = xchacha20poly1305(key, nonce);
const data = utf8ToBytes('hello, noble');
const ciphertext = chacha.encrypt(data);
const data_ = chacha.decrypt(ciphertext); // utils.bytesToUtf8(data_) === data
```

--------------------------------

TITLE: Optimizing ChaCha20-Poly1305 with Reused Buffers in JavaScript
DESCRIPTION: This example demonstrates how to optimize memory usage by reusing `Uint8Array` buffers for both input and output during ChaCha20-Poly1305 encryption and decryption. It shows how to prepare a buffer large enough for plaintext and tag, copy the input, and then perform in-place encryption and decryption to avoid additional memory allocations.

SOURCE: https://github.com/paulmillr/noble-ciphers/blob/main/README.md#_snippet_6

LANGUAGE: JavaScript
CODE:
```
import { chacha20poly1305 } from '@noble/ciphers/chacha.js';
import { utf8ToBytes } from '@noble/ciphers/utils.js';
import { randomBytes } from '@noble/ciphers/webcrypto.js';

const key = randomBytes(32);
const nonce = randomBytes(12);
const chacha = chacha20poly1305(key, nonce);

const input = utf8ToBytes('hello, noble'); // length == 12
const inputLength = input.length;
const tagLength = 16;

const buf = new Uint8Array(inputLength + tagLength);
const start = buf.subarray(0, inputLength);
start.set(input); // copy input to buf

chacha.encrypt(start, buf); // encrypt into `buf`
chacha.decrypt(buf, start); // decrypt into `start`
```

--------------------------------

TITLE: Automatic Nonce Handling with XChaCha20-Poly1305 in JavaScript
DESCRIPTION: This example illustrates the use of `managedNonce` to automatically handle nonces for XChaCha20-Poly1305 encryption. The `managedNonce` API abstracts nonce management, prepending the nonce to the ciphertext during encryption and extracting it during decryption, simplifying usage for the developer.

SOURCE: https://github.com/paulmillr/noble-ciphers/blob/main/README.md#_snippet_3

LANGUAGE: JavaScript
CODE:
```
import { xchacha20poly1305 } from '@noble/ciphers/chacha.js';
import { managedNonce } from '@noble/ciphers/webcrypto.js';
import { hexToBytes, utf8ToBytes } from '@noble/ciphers/utils.js';
const key = hexToBytes('fa686bfdffd3758f6377abbc23bf3d9bdc1a0dda4a6e7f8dbdd579fa1ff6d7e1');
const chacha = managedNonce(xchacha20poly1305)(key); // manages nonces for you
const data = utf8ToBytes('hello, noble');
const ciphertext = chacha.encrypt(data);
const data_ = chacha.decrypt(ciphertext);
```

--------------------------------

TITLE: Contributing and Testing Commands for Noble Ciphers - Shell
DESCRIPTION: This snippet provides a set of `npm` commands for developers to build, test, lint, format, and run benchmarks for the noble ciphers library. These commands are essential for contributing to the project and ensuring code quality and performance.

SOURCE: https://github.com/paulmillr/noble-ciphers/blob/main/README.md#_snippet_11

LANGUAGE: Shell
CODE:
```
npm install && npm run build && npm test
```

LANGUAGE: Shell
CODE:
```
npm run lint
```

LANGUAGE: Shell
CODE:
```
npm run format
```

LANGUAGE: Shell
CODE:
```
npm run bench
```

LANGUAGE: Shell
CODE:
```
npm run bench:install
```

LANGUAGE: Shell
CODE:
```
npm run build:release
```

--------------------------------

TITLE: Demonstrating Various AES Modes (GCM, SIV, CTR, CFB, CBC, ECB, KW) in JavaScript
DESCRIPTION: This snippet showcases the usage of multiple AES encryption modes provided by `@noble/ciphers`, including GCM, SIV, CTR, CFB, CBC, ECB, AESKW, and AESKWP. It demonstrates how to initialize each cipher with appropriate key and nonce sizes (where applicable) and perform encryption and decryption operations for different modes.

SOURCE: https://github.com/paulmillr/noble-ciphers/blob/main/README.md#_snippet_4

LANGUAGE: JavaScript
CODE:
```
import { gcm, gcmsiv, ctr, cfb, cbc, ecb } from '@noble/ciphers/aes.js';
import { randomBytes } from '@noble/ciphers/webcrypto.js';
const plaintext = new Uint8Array(32).fill(16);
for (let cipher of [gcm, gcmsiv]) {
  const key = randomBytes(32); // 24 for AES-192, 16 for AES-128
  const nonce = randomBytes(12);
  const ciphertext_ = cipher(key, nonce).encrypt(plaintext);
  const plaintext_ = cipher(key, nonce).decrypt(ciphertext_);
}
for (const cipher of [ctr, cbc, cfb]) {
  const key = randomBytes(32); // 24 for AES-192, 16 for AES-128
  const nonce = randomBytes(16);
  const ciphertext_ = cipher(key, nonce).encrypt(plaintext);
  const plaintext_ = cipher(key, nonce).decrypt(ciphertext_);
}
for (const cipher of [ecb]) {
  const key = randomBytes(32); // 24 for AES-192, 16 for AES-128
  const ciphertext_ = cipher(key).encrypt(plaintext);
  const plaintext_ = cipher(key).decrypt(ciphertext_);
}

// AESKW, AESKWP
import { aeskw, aeskwp } from '@noble/ciphers/aes.js';
import { hexToBytes } from '@noble/ciphers/utils.js';

const kek = hexToBytes('000102030405060708090A0B0C0D0E0F');
const keyData = hexToBytes('00112233445566778899AABBCCDDEEFF');
const ciphertext = aeskw(kek).encrypt(keyData);
```

--------------------------------

TITLE: Verifying GitHub Attestation for noble-ciphers.js
DESCRIPTION: This command uses the GitHub CLI to verify the provenance attestation for the `noble-ciphers.js` file. It ensures the integrity and origin of the build, preventing forgery as part of supply chain security measures.

SOURCE: https://github.com/paulmillr/noble-ciphers/blob/main/README.md#_snippet_8

LANGUAGE: shell
CODE:
```
gh attestation verify --owner paulmillr noble-ciphers.js
```

--------------------------------

TITLE: Running Benchmarks for Noble Ciphers (Shell)
DESCRIPTION: This snippet provides shell commands to execute various performance benchmarks for cryptographic algorithms within the noble-ciphers project. It allows running benchmarks for all available libraries or specifically for the 'noble' implementation, covering AEAD, ciphers, AES, and Poly1305.

SOURCE: https://github.com/paulmillr/noble-ciphers/blob/main/benchmark/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
node aead.js              # XChaCha-Poly, etc - all libs
node aead.js noble        # XChaCha-Poly, etc - only noble
node ciphers.js           # ChaCha, etc - all libs
node ciphers.js noble     # ChaCha, etc - only noble
node aes.js               # AES, SIV
node poly.js              # Poly1305
```

--------------------------------

TITLE: Importing Noble Ciphers Modules (TypeScript)
DESCRIPTION: This snippet demonstrates how to import various cipher functions and utility modules from the `@noble/ciphers` library. It highlights the use of sub-imports to ensure a small application size, categorizing imports by authenticated encryption, unauthenticated encryption, key wrapping, and utility functions.

SOURCE: https://github.com/paulmillr/noble-ciphers/blob/main/README.md#_snippet_0

LANGUAGE: TypeScript
CODE:
```
// import * from '@noble/ciphers'; // Error: use sub-imports, to ensure small app size
import { gcm, gcmsiv } from '@noble/ciphers/aes.js';
import { chacha20poly1305, xchacha20poly1305 } from '@noble/ciphers/chacha.js';
import { xsalsa20poly1305 } from '@noble/ciphers/salsa.js';

// Unauthenticated encryption: make sure to use HMAC or similar
import { ctr, cfb, cbc, ecb } from '@noble/ciphers/aes.js';
import { salsa20, xsalsa20 } from '@noble/ciphers/salsa.js';
import { chacha20, xchacha20, chacha8, chacha12 } from '@noble/ciphers/chacha.js';
import { aeskw, aeskwp } from '@noble/ciphers/aes.js'; // KW
import { bytesToHex, hexToBytes, bytesToUtf8, utf8ToBytes } from '@noble/ciphers/utils.js';
import { managedNonce, randomBytes } from '@noble/ciphers/webcrypto.js';
```

--------------------------------

TITLE: Comparison Benchmarks of Noble Ciphers vs. Other Implementations - JavaScript
DESCRIPTION: This snippet presents benchmark comparisons of the noble cryptography library against other JavaScript implementations like tweetnacl, node, stablelib, and aesjs for specific algorithms (xsalsa20poly1305, chacha20poly1305, aes-ctr-256). It demonstrates noble's relative performance in encrypting 1MB data, highlighting its competitive speed.

SOURCE: https://github.com/paulmillr/noble-ciphers/blob/main/README.md#_snippet_10

LANGUAGE: Text
CODE:
```
xsalsa20poly1305 (encrypt, 1MB)
├─tweetnacl x 196 ops/sec
└─noble x 305 ops/sec

chacha20poly1305 (encrypt, 1MB)
├─node x 1,668 ops/sec
├─stablelib x 202 ops/sec
└─noble x 319 ops/sec

aes-ctr-256 (encrypt, 1MB)
├─stablelib x 123 ops/sec
├─aesjs x 42 ops/sec
├─noble-webcrypto x 5,965 ops/sec
└─noble x 124 ops/sec
```

--------------------------------

TITLE: Using Noble Ciphers with WebCrypto API for AES in JavaScript
DESCRIPTION: This snippet demonstrates how to use the `@noble/ciphers` library's WebCrypto wrapper for AES modes (GCM, CTR, CBC). It simplifies access to the built-in `crypto.subtle` API, showing asynchronous encryption and decryption operations with randomly generated keys and nonces.

SOURCE: https://github.com/paulmillr/noble-ciphers/blob/main/README.md#_snippet_5

LANGUAGE: JavaScript
CODE:
```
import { gcm, ctr, cbc, randomBytes } from '@noble/ciphers/webcrypto.js';
const plaintext = new Uint8Array(32).fill(16);
const key = randomBytes(32);
for (const cipher of [gcm]) {
  const nonce = randomBytes(12);
  const ciphertext_ = await cipher(key, nonce).encrypt(plaintext);
  const plaintext_ = await cipher(key, nonce).decrypt(ciphertext_);
}
for (const cipher of [ctr, cbc]) {
  const nonce = randomBytes(16);
  const ciphertext_ = await cipher(key, nonce).encrypt(plaintext);
  const plaintext_ = await cipher(key, nonce).decrypt(plaintext_);
}
```

--------------------------------

TITLE: Deriving Key and Encrypting Data with Scrypt and XChaCha20-Poly1305 (JavaScript)
DESCRIPTION: This snippet demonstrates how to securely derive a 32-byte cryptographic key from a password using the Scrypt Key Derivation Function (KDF) with a high security level, and then use this key with XChaCha20-Poly1305 for authenticated encryption. It highlights the use of a salt (app-specific secret) and a managed nonce for secure operations.

SOURCE: https://github.com/paulmillr/noble-ciphers/blob/main/README.md#_snippet_7

LANGUAGE: js
CODE:
```
import { xchacha20poly1305 } from '@noble/ciphers/chacha.js';
import { managedNonce } from '@noble/ciphers/webcrypto.js';
import { scrypt } from '@noble/hashes/scrypt.js';

// Convert password into 32-byte key using scrypt
const PASSWORD = 'correct-horse-battery-staple';
const APP_SPECIFIC_SECRET = 'salt-12345678-secret';
const SECURITY_LEVEL = 2 ** 20; // requires 1GB of RAM to calculate
// sync, but scryptAsync is also available
const key = scrypt(PASSWORD, APP_SPECIFIC_SECRET, { N: SECURITY_LEVEL, r: 8, p: 1, dkLen: 32 });

// Use random, managed nonce
const chacha = managedNonce(xchacha20poly1305)(key);

const data = utf8ToBytes('hello, noble');
const ciphertext = chacha.encrypt(data);
const data_ = chacha.decrypt(ciphertext);
```

--------------------------------

TITLE: Performance Benchmarks for Noble Ciphers (64B and 1MB) - JavaScript
DESCRIPTION: This snippet displays benchmark results for various cryptographic algorithms (Salsa20, ChaCha20, AES-GCM, etc.) implemented in JavaScript, showing operations per second and time per operation for 64B and 1MB data sizes. It highlights the library's speed for both authenticated and unauthenticated encryption on an Apple M4 processor.

SOURCE: https://github.com/paulmillr/noble-ciphers/blob/main/README.md#_snippet_9

LANGUAGE: Text
CODE:
```
64B
xsalsa20poly1305 x 675,675 ops/sec @ 1μs/op
chacha20poly1305 x 568,181 ops/sec @ 1μs/op
xchacha20poly1305 x 460,617 ops/sec @ 2μs/op
aes-256-gcm x 201,126 ops/sec @ 4μs/op
aes-256-gcm-siv x 162,284 ops/sec @ 6μs/op
# Unauthenticated encryption
salsa20 x 1,655,629 ops/sec @ 604ns/op
xsalsa20 x 1,400,560 ops/sec @ 714ns/op
chacha20 x 1,996,007 ops/sec @ 501ns/op
xchacha20 x 1,404,494 ops/sec @ 712ns/op
chacha8 x 2,145,922 ops/sec @ 466ns/op
chacha12 x 2,036,659 ops/sec @ 491ns/op
aes-ecb-256 x 1,019,367 ops/sec @ 981ns/op
aes-cbc-256 x 931,966 ops/sec @ 1μs/op
aes-ctr-256 x 954,198 ops/sec @ 1μs/op

1MB
xsalsa20poly1305 x 322 ops/sec @ 3ms/op
chacha20poly1305 x 327 ops/sec @ 3ms/op
xchacha20poly1305 x 331 ops/sec @ 3ms/op
aes-256-gcm x 94 ops/sec @ 10ms/op
aes-256-gcm-siv x 90 ops/sec @ 11ms/op
# Unauthenticated encryption
salsa20 x 791 ops/sec @ 1ms/op
xsalsa20 x 801 ops/sec @ 1ms/op
chacha20 x 787 ops/sec @ 1ms/op
xchacha20 x 781 ops/sec @ 1ms/op
chacha8 x 1,457 ops/sec @ 686μs/op
chacha12 x 1,130 ops/sec @ 884μs/op
aes-ecb-256 x 289 ops/sec @ 3ms/op
aes-cbc-256 x 114 ops/sec @ 8ms/op
aes-ctr-256 x 127 ops/sec @ 7ms/op
# Wrapper over built-in webcrypto
webcrypto ctr-256 x 6,508 ops/sec @ 153μs/op
webcrypto cbc-256 x 1,820 ops/sec @ 549μs/op
webcrypto gcm-256 x 5,106 ops/sec @ 195μs/op
```

--------------------------------

TITLE: Encrypting Data with AES-256-GCM in JavaScript
DESCRIPTION: This snippet demonstrates how to perform AES-256-GCM encryption and decryption using the `@noble/ciphers` library. It shows the generation of a random key and nonce, converting data to bytes, encrypting the plaintext, and then decrypting the ciphertext back to the original data.

SOURCE: https://github.com/paulmillr/noble-ciphers/blob/main/README.md#_snippet_2

LANGUAGE: JavaScript
CODE:
```
import { gcm } from '@noble/ciphers/aes.js';
import { utf8ToBytes } from '@noble/ciphers/utils.js';
import { randomBytes } from '@noble/ciphers/webcrypto.js';
const key = randomBytes(32);
const nonce = randomBytes(24);
const data = utf8ToBytes('hello, noble');
const aes = gcm(key, nonce);
const ciphertext = aes.encrypt(data);
const data_ = aes.decrypt(ciphertext); // utils.bytesToUtf8(data_) === data
```



================
CODE SNIPPETS
================
TITLE: Commit Hash Example 15
DESCRIPTION: A further example of a commit hash from the Noble Curves project, demonstrating the format of these version identifiers.

SOURCE: https://github.com/paulmillr/noble-curves/blob/main/test/vectors/bls12-381/bls12-381-g2-test-vectors.txt#_snippet_66

LANGUAGE: plaintext
CODE:
```
78558ec1b78bada4d8ce4b1816eca078e19f96891b1198418c36306db8d013a0:0287a3353e386d8fa1a6477424dcf1:84df1942271b5488ccf46f85ea23391a54734fb778dcdc26b0c4472290496c02f82e28e28157ffc742006fd5f8cad89d16303b802ee4c0ec6b52a998c80fa848c90e7ed5f89349bfd8899ce0f4856f956db7f9e34f7b28b6374dc3e6d5426c95
```

--------------------------------

TITLE: Commit Hash Example 9
DESCRIPTION: An additional commit hash example from the Noble Curves project, demonstrating the format of these version control identifiers.

SOURCE: https://github.com/paulmillr/noble-curves/blob/main/test/vectors/bls12-381/bls12-381-g2-test-vectors.txt#_snippet_60

LANGUAGE: plaintext
CODE:
```
872cdcc462f7c537801beda2a5ab2490f2ccdecd0c075d05a7562b718d88bd76:046b1e0da58edc394def89fd:86f901ad63d6e46fcf31e6933b76300d355a23ff08710f34b8d20eb8ed7e1ab3a1a2536d10d4f8b307b36041de380769185a831dbd6bfb44cd40da1d7771379c9ad8fac09ccbc2ac67a92cfbed25848cc4aa32511b1c2739434c0c6599398418
```

--------------------------------

TITLE: Commit Hash Example 13
DESCRIPTION: An additional commit hash example from the Noble Curves project, demonstrating the format of these version control identifiers.

SOURCE: https://github.com/paulmillr/noble-curves/blob/main/test/vectors/bls12-381/bls12-381-g2-test-vectors.txt#_snippet_64

LANGUAGE: plaintext
CODE:
```
d588173ab8a6de5b4026218d4860ce9f7796dd05a6333caab951c1ee113f4418:00d7ea9c8a165b4dfd71242abc84:b3bbac928f55a5bc88d9fcfa166d3d5445efb48d5fb564d6fdb13aab32a443764994913dabdcf103c51999ee1abdf011117d77221165cfa0455c56a690a99aad5ecf0429c09fbf6d18facf5762cb1d2c759e2cca4fb1db3e23a54cb85d554750
```

--------------------------------

TITLE: Commit Hash Example 17
DESCRIPTION: An additional commit hash example from the Noble Curves project, demonstrating the format of these version control identifiers.

SOURCE: https://github.com/paulmillr/noble-curves/blob/main/test/vectors/bls12-381/bls12-381-g2-test-vectors.txt#_snippet_68

LANGUAGE: plaintext
CODE:
```
4e6237d14a3cd9ea629413caa7c05627220e7f4e87ad60fa17a35916e111d5b3:0b:ad095916915d21a753c5ed1036f8ce695bc763c753dacf18fc696a691cb2d9d4d305255f0371ed05459225b52f45a9ce102fced5a32e0776ef97b2f047c73833a90196bf6e7cfc424dc3b9538e4a49a41c584c093be2851d08f3ef7118e4a71c
```

--------------------------------

TITLE: Commit Hash Example 5
DESCRIPTION: An additional commit hash example from the Noble Curves project, showcasing the format of version control identifiers.

SOURCE: https://github.com/paulmillr/noble-curves/blob/main/test/vectors/bls12-381/bls12-381-g2-test-vectors.txt#_snippet_56

LANGUAGE: plaintext
CODE:
```
d9a329774f9b39f814fde151cc32bf74e8a1cff727f83646f55bf001d2a6f603:055cdabebdb7c39371a4:b81b341a8a1f8ea7bfa3ae218f74eebf251526b9d2243247dd9b097521deab083ffe10a877f349a890d74a82c78240cb0929fdedd37e4eee257688adbbd921f7e3d30d32daa6924afc8172988490829a022a769517cca57feaab140f3ed91458
```

--------------------------------

TITLE: Commit Hash Example 7
DESCRIPTION: A further example of a commit hash from the Noble Curves project, demonstrating the format of these version identifiers.

SOURCE: https://github.com/paulmillr/noble-curves/blob/main/test/vectors/bls12-381/bls12-381-g2-test-vectors.txt#_snippet_58

LANGUAGE: plaintext
CODE:
```
1620bf3cc64af7a12e3bf1a65859c37c0deceabc9765295f24294e5e408ad93f:0723c6a62f4e556ad97947:8abf62b2bf3d9c3524cb6639f3c94cb4e215aaead42ac8608d0a8c1495f766d7626299bed2eb309e3b3566d76ca87de7168bb651726d0427f6395ff81bea526afe56614486444fd1fdf01a2f836e35fd7dc740be034b02a2ccf585bb490e6f07
```

--------------------------------

TITLE: Commit Hash Example 11
DESCRIPTION: A further example of a commit hash from the Noble Curves project, demonstrating the format of these version identifiers.

SOURCE: https://github.com/paulmillr/noble-curves/blob/main/test/vectors/bls12-381/bls12-381-g2-test-vectors.txt#_snippet_62

LANGUAGE: plaintext
CODE:
```
838dcf72e258d2a77bd369353baa2209c1c2f40812803bc74c7bd1c696260ae0:0155257765b6d64a092ca412d9:98c0da445f6f0e4b03d6a3c956ef55c9c77bd7828c84085a4c776b88963d2d190f05ba5834697bfcddd734850c55c99d07c932d98fa4cecff22c887d19837cb6a67122e96f2f58103c5baabe21da9d03efcdb7d91d58e1c7b6d5bf231b6628eb
```

--------------------------------

TITLE: Project Setup and Testing
DESCRIPTION: Instructions for setting up the project, running tests, linting, formatting, and executing benchmarks.

SOURCE: https://github.com/paulmillr/noble-curves/blob/main/README.md#_snippet_25

LANGUAGE: APIDOC
CODE:
```
Install dependencies and build: `npm install && npm run build`
Run tests: `npm test`
Lint code: `npm run lint`
Format code: `npm run format`
Run benchmarks: `npm run bench` (may require `npm run bench:install` first)
Build release: `npm run build:release`
```

--------------------------------

TITLE: Commit Hash Example 3
DESCRIPTION: A third example of a commit hash, demonstrating the consistent pattern of identifiers within the Noble Curves repository.

SOURCE: https://github.com/paulmillr/noble-curves/blob/main/test/vectors/bls12-381/bls12-381-g2-test-vectors.txt#_snippet_54

LANGUAGE: plaintext
CODE:
```
2301e3208dc15a69334232fa6249a28238e7eebcbabca532719b50dcbb6eab16:03c1ad665dea01bfa5:820ef925b76285789c449fece5f0765661cf3ce95ef7b6482c6c35151e61f5be1f7f08a25cc647d1e2539e5e4811fe771829d666c84f6db43f351c41252e3fa27432a399af25272dade4b6d1da95aec40d6b83a5b82dee79b7ea3568e8a8dd6c
```

--------------------------------

TITLE: Commit Hash Example 2
DESCRIPTION: Another example of a commit hash from the Noble Curves project, illustrating the format used for tracking changes.

SOURCE: https://github.com/paulmillr/noble-curves/blob/main/test/vectors/bls12-381/bls12-381-g2-test-vectors.txt#_snippet_53

LANGUAGE: plaintext
CODE:
```
f41439fd6f3c477089e6e6ea9a1e91e11ce62998db83b07ad2e0f114f9acdcbe:662c4514041b22a7:a23e7d4af64aee50d4bea6adb1ed6797e26613753c8dcf7d4aff5136ac8bab0be75dbe3d60d95f8639914dfc73fe620419a6288d6920d3bf95b86537acd12aac5be76804edd064e2a55af43ec73e42b4aefd10f01b64867f14bd452e34ce03dd
```

--------------------------------

TITLE: Run Benchmarks
DESCRIPTION: Installs benchmark dependencies and runs the benchmark suite for the noble-curves library. This command is used to measure the performance of cryptographic operations.

SOURCE: https://github.com/paulmillr/noble-curves/blob/main/README.md#_snippet_19

LANGUAGE: sh
CODE:
```
npm run bench:install && npm run bench
```

--------------------------------

TITLE: Commit Hash Example 6
DESCRIPTION: This snippet provides another example of a commit hash from the Noble Curves project, illustrating the typical identifier structure.

SOURCE: https://github.com/paulmillr/noble-curves/blob/main/test/vectors/bls12-381/bls12-381-g2-test-vectors.txt#_snippet_57

LANGUAGE: plaintext
CODE:
```
5a0155ddda1e372e176dd4841998d8373a4db70f720e13f8191a323dae9151f8:ed74bc9283fe9f0df46a:97bf50cf9ce75ddb14e7fe58fbe911aba7f2ff24c5982ac33803ffc578aa7f956c2cca4d436ee7cc0f66c3378470251a05b6570964abbdfaee44f9761581b89468833d000ff8f4f6432c5bbb7f084757328ce3501c055d9b8d1a44a797e7b93b
```

--------------------------------

TITLE: Commit Hash Example 16
DESCRIPTION: This snippet shows another commit hash from the Noble Curves project, illustrating the structure of these version identifiers.

SOURCE: https://github.com/paulmillr/noble-curves/blob/main/test/vectors/bls12-381/bls12-381-g2-test-vectors.txt#_snippet_67

LANGUAGE: plaintext
CODE:
```
e491b15ebad91fb2e487850ad754edbe4e9542a699acd3d5dd186ddb65c57844::a019419fde4a1436a79fcdf62919000cde8cdfc1c3c827edb03b2224fd66951bdc168f74a02231ad3cc6fe821616b5b409e2dad609dc6175287d355a56dc8cbf34811a3cb89242c451fe8f32784fc1e84d078733eb3e43abc916f9c
```

--------------------------------

TITLE: Commit Hash Example 12
DESCRIPTION: This snippet shows another commit hash from the Noble Curves project, illustrating the structure of these version identifiers.

SOURCE: https://github.com/paulmillr/noble-curves/blob/main/test/vectors/bls12-381/bls12-381-g2-test-vectors.txt#_snippet_63

LANGUAGE: plaintext
CODE:
```
1c37c9dfbce948e9b854a16e5705d39d6814c99db8cd4d21bd17e4b489be8ec0:f29274076eb714c9a1e0cc7c4a:90436ee33fc91061cfeeec29ee065bbf0fb1504c588a057bc7a47e6d706826a03eb75916b5a0802e6bccd600e479579709af6bf0e69892f863cea2d17c7cee0b4aa0d01ad38a100c1f0a92a0d9bb8a662a4802e68fc61a6f89ae5a967e2ade24
```

--------------------------------

TITLE: Commit Hash Example 8
DESCRIPTION: This snippet shows another commit hash from the Noble Curves project, illustrating the structure of these version identifiers.

SOURCE: https://github.com/paulmillr/noble-curves/blob/main/test/vectors/bls12-381/bls12-381-g2-test-vectors.txt#_snippet_59

LANGUAGE: plaintext
CODE:
```
25eaab4800d7b399f81ed647c1c2062db996f9edaeba7411c9b1e47936963816:51410ca4fbc1eef3fe15e8:8d0e31286039c789bc46dc89914a3a7afb47bf3c1b6e3e06b618e5310f8efbbd43f484bd182b1a25d4977fb4d6965e670db5b4fbb9be287d8f3a5596e118c43032d199f93fcc8a60546d45c4b0745b4fd8432534175e9a620782bbf5c72b6c79
```

--------------------------------

TITLE: Commit Hash Example 10
DESCRIPTION: This snippet presents another commit hash from the Noble Curves project, highlighting the consistent structure of these identifiers.

SOURCE: https://github.com/paulmillr/noble-curves/blob/main/test/vectors/bls12-381/bls12-381-g2-test-vectors.txt#_snippet_61

LANGUAGE: plaintext
CODE:
```
ac8fbd5b0a2a1d7a18279a4a77781f1176125de642bb3532db38fd1b9029caab:4e99b2a8d76e3a8599f34e0f:a30b77a191250947cd5653b09b21c0766aab216ba514e78027ce01e428211cd5c3c4268a546a51e0953e0ab1a278fcdf0f19285b85dc15b479e47ead63398d87272545c1928f0d62a6d7a7ffa507ca5a6a3738ffa341556aeaffd6a94268a2d4
```

--------------------------------

TITLE: Commit Hash Example 4
DESCRIPTION: This snippet presents another commit hash from the Noble Curves project, highlighting the structure of these identifiers.

SOURCE: https://github.com/paulmillr/noble-curves/blob/main/test/vectors/bls12-381/bls12-381-g2-test-vectors.txt#_snippet_55

LANGUAGE: plaintext
CODE:
```
a812cc9efa293804c8dd535d4d8c6ad424cf0b82855b58ea5dbc9dcc432aa311:3249c17e4e56f7b787:a1fb4d9bf530927b578d8317f7045c5531d03e9dcffb3cf4467953119f8d96c4c6fd094ad34b742daee909ed59e7f9340eacf47ee9cf353cc63f18748f86fcf237a893543acf9fa96ebdbeca5ef189a4e8f780c1c402017aa0ae9e0fec11c0a2
```

--------------------------------

TITLE: Commit Hash Example 1
DESCRIPTION: This snippet shows a typical commit hash structure found in the Noble Curves project, likely representing a specific version or change.

SOURCE: https://github.com/paulmillr/noble-curves/blob/main/test/vectors/bls12-381/bls12-381-g2-test-vectors.txt#_snippet_52

LANGUAGE: plaintext
CODE:
```
5e104f67360bd7be86562856628f7ca8d6f6090e58d78d1bad5faf7b6d01ba96:0ddd0c7f788fa3c2:8abbf1c71d4b4d62046e7557f34ddefcf0ddf8b7991ae8674fa3d73de1865065e98f914fa49772348b4665f102f2ca1515d21364050ab724a0ae95002ac7f2bdfbbe7d7ec1bb8f6b343c4409ad993b39b0d2ebd4a1a001909a1570760d29c246
```

--------------------------------

TITLE: Commit Hash Example 14
DESCRIPTION: This snippet presents another commit hash from the Noble Curves project, highlighting the consistent structure of these identifiers.

SOURCE: https://github.com/paulmillr/noble-curves/blob/main/test/vectors/bls12-381/bls12-381-g2-test-vectors.txt#_snippet_65

LANGUAGE: plaintext
CODE:
```
9044a9f62013273404561e373509bb12950260013cfaaf455036174611c62d4b:feb386e695739cd3a97061627019:b9f61eba10d0876ee182a899a5e09b78e1db4436960ceb6a9c7e56a133b1adbd3c46711d0e50f854b7839f07984b19a800ba90bdc779327e045ceba39caf33c6ddff31ed7a2b59de65b1361bf787ff05a7e09b706699d150a6e4225a9a3e0cb0
```

================
CODE SNIPPETS
================
TITLE: Running Noble-Hashes Benchmarks
DESCRIPTION: This shell command sequence first installs necessary benchmark dependencies (`bench:install`) and then executes the performance benchmarks (`bench`) for the `noble-hashes` library. It's used to measure the speed of various hash functions.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/README.md#_snippet_13

LANGUAGE: sh
CODE:
```
npm run bench:install && npm run bench
```

--------------------------------

TITLE: Building and Testing Noble Hashes
DESCRIPTION: This command sequence is used to set up, build, and run tests for the Noble Hashes library. It first installs dependencies, then compiles the code, and finally executes the test suite to ensure functionality.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/README.md#_snippet_16

LANGUAGE: Shell
CODE:
```
npm install && npm run build && npm test
```

--------------------------------

TITLE: Running Benchmarks for Noble Hashes
DESCRIPTION: This command executes the performance benchmarks for the Noble Hashes library. It measures the speed of various cryptographic operations, providing insights into the library's efficiency. Note that `npm run bench:install` might be needed first for dependencies.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/README.md#_snippet_18

LANGUAGE: Shell
CODE:
```
npm run bench
```

--------------------------------

TITLE: Using BLAKE1, BLAKE2, and BLAKE3 Hashes in TypeScript
DESCRIPTION: This snippet demonstrates the usage of BLAKE1, BLAKE2 (BLAKE2b, BLAKE2s), and BLAKE3 hash functions from `@noble/hashes`. It shows basic hashing with both direct and streaming APIs. Advanced usage examples for BLAKE2 and BLAKE3 are provided, illustrating how to use optional parameters like `key`, `personalization`, `salt`, `dkLen` (derived key length), and `context` to customize the hashing process.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/README.md#_snippet_4

LANGUAGE: TypeScript
CODE:
```
import { blake224, blake256, blake384, blake512 } from '@noble/hashes/blake1.js';
import { blake2b, blake2s } from '@noble/hashes/blake2.js';
import { blake3 } from '@noble/hashes/blake3.js';

for (let hash of [blake224, blake256, blake384, blake512, blake2b, blake2s, blake3]) {
  const arr = Uint8Array.from([0x10, 0x20, 0x30]);
  const a = hash(arr);
  const b = hash.create().update(arr).digest();
}

// blake2 advanced usage
const ab = Uint8Array.from([0x01]);
blake2s(ab);
blake2s(ab, { key: new Uint8Array(32) });
blake2s(ab, { personalization: 'pers1234' });
blake2s(ab, { salt: 'salt1234' });
blake2b(ab);
blake2b(ab, { key: new Uint8Array(64) });
blake2b(ab, { personalization: 'pers1234pers1234' });
blake2b(ab, { salt: 'salt1234salt1234' });

// blake3 advanced usage
blake3(ab);
blake3(ab, { dkLen: 256 });
blake3(ab, { key: new Uint8Array(32) });
blake3(ab, { context: 'application-name' });
```

--------------------------------

TITLE: Running Big Multicore Test for Noble Hashes
DESCRIPTION: This command starts a 2-hour 'big' multicore test for the Noble Hashes library. This extensive test evaluates the library's performance and stability across multiple CPU cores, simulating demanding, long-duration usage scenarios.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/README.md#_snippet_21

LANGUAGE: Shell
CODE:
```
npm run test:big
```

--------------------------------

TITLE: Using SHA2 Hash Functions with Direct and Chained Updates in TypeScript
DESCRIPTION: This TypeScript example illustrates the usage of various SHA2 hash functions, including `sha256`, `sha384`, and `sha512`. It shows both direct hashing of a `Uint8Array` and the more advanced method of creating a hash instance, updating it with data in chunks, and then digesting the result. This demonstrates support for partial updates and chaining.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/README.md#_snippet_1

LANGUAGE: TypeScript
CODE:
```
import { sha224, sha256, sha384, sha512, sha512_224, sha512_256 } from '@noble/hashes/sha2.js';
const res = sha256(Uint8Array.from([0xbc])); // basic
for (let hash of [sha256, sha384, sha512, sha224, sha512_224, sha512_256]) {
  const arr = Uint8Array.from([0x10, 0x20, 0x30]);
  const a = hash(arr);
  const b = hash.create().update(arr).digest();
}
```

--------------------------------

TITLE: Executing All Main Tests (npm)
DESCRIPTION: This command runs the primary test suite for the noble-hashes library, covering general functionality and ensuring core hash functions work as expected.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/test/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
npm run test
```

--------------------------------

TITLE: Building Single File Release for Noble Hashes
DESCRIPTION: This command compiles the Noble Hashes library into a single, optimized file for release. This is useful for deployment scenarios where a consolidated file is preferred, simplifying distribution and integration.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/README.md#_snippet_19

LANGUAGE: Shell
CODE:
```
npm run build:release
```

--------------------------------

TITLE: Executing Large Input & Scrypt Combination Tests (npm)
DESCRIPTION: This command performs extensive tests, including hashing on 4GiB inputs and scrypt with 1024 different N, r, p combinations. It is a very long-running test, potentially taking several hours, and benefits from multi-core CPUs.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/test/README.md#_snippet_2

LANGUAGE: Shell
CODE:
```
npm run test-big
```

--------------------------------

TITLE: Executing DoS Vulnerability Tests (npm)
DESCRIPTION: This command initiates tests specifically designed to check for Denial-of-Service vulnerabilities by measuring function formulas. It is a long-running test, taking approximately one hour to complete.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/test/README.md#_snippet_1

LANGUAGE: Shell
CODE:
```
npm run test-dos
```

--------------------------------

TITLE: Linting and Formatting Noble Hashes Code
DESCRIPTION: These commands are used for maintaining code quality and consistency within the Noble Hashes project. `npm run lint` identifies potential errors and style issues, while `npm run format` automatically fixes formatting problems according to predefined rules.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/README.md#_snippet_17

LANGUAGE: Shell
CODE:
```
npm run lint
```

LANGUAGE: Shell
CODE:
```
npm run format
```

--------------------------------

TITLE: Running DoS Test for Noble Hashes
DESCRIPTION: This command initiates a 20-minute Denial-of-Service (DoS) test for the Noble Hashes library. This specialized test helps ensure the library's resilience and stability under sustained, potentially abusive, load conditions.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/README.md#_snippet_20

LANGUAGE: Shell
CODE:
```
npm run test:dos
```

--------------------------------

TITLE: Benchmarking KDF Performance in Noble Hashes (Pure-JS)
DESCRIPTION: This snippet shows benchmark results for various Key Derivation Functions (KDFs) implemented in the Noble Hashes library. It provides operations per second and time per operation for hkdf, blake3, pbkdf2, scrypt, and argon2id, highlighting their relative performance in a pure JavaScript context.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/README.md#_snippet_14

LANGUAGE: Shell
CODE:
```
# KDF
hkdf(sha256) x 259,942 ops/sec @ 3μs/op
blake3(context) x 424,808 ops/sec @ 2μs/op
pbkdf2(sha256, c: 2 ** 18) x 5 ops/sec @ 197ms/op
pbkdf2(sha512, c: 2 ** 18) x 1 ops/sec @ 630ms/op
scrypt(n: 2 ** 18, r: 8, p: 1) x 2 ops/sec @ 400ms/op
argon2id(t: 1, m: 256MB) 2881ms
```

--------------------------------

TITLE: Implementing SHA-3 Addons (cSHAKE, KMAC, K12, M14, TurboSHAKE) in TypeScript
DESCRIPTION: This snippet demonstrates the usage of various SHA-3 addon functions from `@noble/hashes/sha3-addons.js`, including cSHAKE, TurboSHAKE, TupleHash, ParallelHash, KMAC, K12, M14, and KeccakPRG. It shows how to apply personalization strings, domain separation values (D), and keys for different algorithms. It also illustrates the use of `keccakprg` for pseudo-random generation, showing how to feed data and fetch random bytes.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/README.md#_snippet_3

LANGUAGE: TypeScript
CODE:
```
import {
  cshake128, cshake256, k12, m14,
  keccakprg, kmac128, kmac256,
  parallelhash256, tuplehash256,
  turboshake128, turboshake256,
} from '@noble/hashes/sha3-addons.js';
const data = Uint8Array.from([0x10, 0x20, 0x30]);
const ec1 = cshake128(data, { personalization: 'def' });
const ec2 = cshake256(data, { personalization: 'def' });
const et1 = turboshake128(data);
const et2 = turboshake256(data, { D: 0x05 });
// tuplehash(['ab', 'c']) !== tuplehash(['a', 'bc']) !== tuplehash([data])
const et3 = tuplehash256([utf8ToBytes('ab'), utf8ToBytes('c')]);
// Not parallel in JS (similar to blake3 / k12), added for compat
const ep1 = parallelhash256(data, { blockLen: 8 });
const kk = Uint8Array.from([0xca]);
const ek10 = kmac128(kk, data);
const ek11 = kmac256(kk, data);
const ek12 = k12(data);
const ek13 = m14(data);
// pseudo-random generator, first argument is capacity. XKCP recommends 254 bits capacity for 128-bit security strength.
// * with a capacity of 254 bits.
const p = keccakprg(254);
p.feed('test');
const rand1b = p.fetch(1);
```

--------------------------------

TITLE: Using SHA-3, Keccak, and SHAKE Hashes in TypeScript
DESCRIPTION: This snippet demonstrates how to import and use various SHA-3, Keccak, and SHAKE hash functions from `@noble/hashes/sha3.js`. It shows both direct hashing of a `Uint8Array` and the streaming API using `create().update().digest()` for different hash variants like SHA3-224, SHA3-256, SHA3-384, SHA3-512, Keccak-224, Keccak-256, Keccak-384, Keccak-512, SHAKE128, and SHAKE256. SHAKE functions also illustrate the `dkLen` option for desired output length.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/README.md#_snippet_2

LANGUAGE: TypeScript
CODE:
```
import {
  sha3_224, sha3_256, sha3_384, sha3_512,
  keccak_224, keccak_256, keccak_384, keccak_512,
  shake128, shake256,
} from '@noble/hashes/sha3.js';
for (let hash of [
  sha3_224, sha3_256, sha3_384, sha3_512,
  keccak_224, keccak_256, keccak_384, keccak_512,
]) {
  const arr = Uint8Array.from([0x10, 0x20, 0x30]);
  const a = hash(arr);
  const b = hash.create().update(arr).digest();
}
const shka = shake128(Uint8Array.from([0x10]), { dkLen: 512 });
const shkb = shake256(Uint8Array.from([0x30]), { dkLen: 512 });
```

--------------------------------

TITLE: Verifying Noble-Hashes.js Provenance with GitHub CLI
DESCRIPTION: This command uses the GitHub CLI to verify the provenance of the `noble-hashes.js` file, ensuring it was built and released transparently by the specified owner. It helps in validating the supply chain security of the library.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/README.md#_snippet_12

LANGUAGE: sh
CODE:
```
gh attestation verify --owner paulmillr noble-hashes.js
```

--------------------------------

TITLE: Importing and Using SHA256 in JavaScript
DESCRIPTION: This snippet demonstrates how to import the `sha256` hash function from `@noble/hashes/sha2.js` and use it to hash a `Uint8Array`. It also lists various other hash functions, MACs, and KDFs available for import from different sub-modules, highlighting the modularity of the library. The library encourages sub-imports to minimize application size.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/README.md#_snippet_0

LANGUAGE: JavaScript
CODE:
```
// import * from '@noble/hashes'; // Error: use sub-imports, to ensure small app size
import { sha256 } from '@noble/hashes/sha2.js'; // ESM & Common.js
sha256(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])); // returns Uint8Array

// Available modules
import { sha256, sha384, sha512, sha224, sha512_224, sha512_256 } from '@noble/hashes/sha2.js';
import {
  sha3_256, sha3_512,
  keccak_256, keccak_512,
  shake128, shake256,
} from '@noble/hashes/sha3.js';
import {
  cshake256, turboshake256, kmac256, tuplehash256,
  k12, m14, keccakprg,
} from '@noble/hashes/sha3-addons.js';
import { blake3 } from '@noble/hashes/blake3.js';
import { blake2b, blake2s } from '@noble/hashes/blake2.js';
import { blake256, blake512 } from '@noble/hashes/blake1.js';
import { sha1, md5, ripemd160 } from '@noble/hashes/legacy.js';
import { hmac } from '@noble/hashes/hmac.js';
import { hkdf } from '@noble/hashes/hkdf.js';
import { pbkdf2, pbkdf2Async } from '@noble/hashes/pbkdf2.js';
import { scrypt, scryptAsync } from '@noble/hashes/scrypt.js';
import { argon2d, argon2i, argon2id } from '@noble/hashes/argon2.js';
import * as utils from '@noble/hashes/utils'; // bytesToHex, bytesToUtf8, concatBytes...
```

--------------------------------

TITLE: Unrolled Loop for Bitwise XOR Operations in JavaScript
DESCRIPTION: This snippet illustrates the concept of loop unrolling to optimize bitwise XOR operations. Instead of a loop, each operation is explicitly written out, eliminating array access overhead and bound checks, which can significantly improve performance. The `// ...` indicates continuation for other `B` variables.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/benchmark/README.md#_snippet_1

LANGUAGE: JavaScript
CODE:
```
let B0 = s0 ^ s10 ^ s20 ^ s30 ^ s40;
let B1 = s1 ^ s11 ^ s21 ^ s31 ^ s41; // ...
```

--------------------------------

TITLE: Comparing Native Node.js Hash and KDF Performance
DESCRIPTION: This snippet presents benchmark results for cryptographic functions using Node.js's native C bindings. It compares the performance of various hash algorithms (SHA256, SHA512, SHA3_256, BLAKE2b, BLAKE2s, HMAC, HKDF) and KDFs (PBKDF2, Scrypt) against pure-JS implementations, showing the speed advantage of native code.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/README.md#_snippet_15

LANGUAGE: Shell
CODE:
```
# native (node) 32B
sha256 x 2,267,573 ops/sec
sha512 x 983,284 ops/sec
sha3_256 x 1,522,070 ops/sec
blake2b x 1,512,859 ops/sec
blake2s x 1,821,493 ops/sec
hmac(sha256) x 1,085,776 ops/sec
hkdf(sha256) x 312,109 ops/sec
# native (node) KDF
pbkdf2(sha256, c: 2 ** 18) x 5 ops/sec @ 197ms/op
pbkdf2(sha512, c: 2 ** 18) x 1 ops/sec @ 630ms/op
scrypt(n: 2 ** 18, r: 8, p: 1) x 2 ops/sec @ 378ms/op
```

--------------------------------

TITLE: Run-time Loop Unrolling with `new Function` in JavaScript
DESCRIPTION: This snippet demonstrates run-time loop unrolling using `new Function` (eval). It dynamically constructs a string containing unrolled bitwise XOR operations and then creates a new function from this string. This method generates highly optimized code at runtime but is incompatible with CSP policies that disallow `unsafe-eval`.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/benchmark/README.md#_snippet_2

LANGUAGE: JavaScript
CODE:
```
let out = ''
for (let x = 0; x < 10; x++)
 out += `let B${x} = s${x} ^ s${x + 10} ^ s${x + 20} ^ s${x + 30} ^ s${x + 40};\n`;
const UNROLLED_FN = new Function('state', out);
```

--------------------------------

TITLE: Looping Array Access for Bitwise XOR in JavaScript
DESCRIPTION: This snippet demonstrates a standard loop for performing bitwise XOR operations on array elements. It iterates 10 times, calculating a value for `B[x]` by XORing elements from array `s` at specific offsets. This approach is noted as being slow due to array bound checks.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/benchmark/README.md#_snippet_0

LANGUAGE: JavaScript
CODE:
```
for (let x = 0; x < 10; x++)
  B[x] = s[x] ^ s[x+10] ^ s[x+20] ^ s[x+30] ^ s[x+40];
```

--------------------------------

TITLE: Deriving Keys with Argon2 in TypeScript
DESCRIPTION: This snippet demonstrates using Argon2 for password hashing, specifically the argon2id variant, from @noble/hashes/argon2.js. It highlights the configuration parameters t (time cost), m (memory cost), and p (parallelism). A warning is included regarding Argon2's performance limitations in JavaScript environments due to the lack of fast Uint64Array support, suggesting Scrypt as a more performant alternative.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/README.md#_snippet_10

LANGUAGE: TypeScript
CODE:
```
import { argon2d, argon2i, argon2id } from '@noble/hashes/argon2.js';
const arg1 = argon2id('password', 'saltsalt', { t: 2, m: 65536, p: 1, maxmem: 2 ** 32 - 1 });
```

--------------------------------

TITLE: Deriving Keys with Scrypt in TypeScript
DESCRIPTION: This snippet demonstrates using Scrypt for password-based key derivation, available in both synchronous (scrypt) and asynchronous (scryptAsync) versions. It highlights configuring work factors (N, r, p), output key length (dkLen), and advanced options like onProgress for async operations and maxmem for memory control. Scrypt is recommended over Argon2 in JavaScript due to performance considerations and conforms to RFC 7914.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/README.md#_snippet_9

LANGUAGE: TypeScript
CODE:
```
import { scrypt, scryptAsync } from '@noble/hashes/scrypt.js';
const scr1 = scrypt('password', 'salt', { N: 2 ** 16, r: 8, p: 1, dkLen: 32 });
const scr2 = await scryptAsync('password', 'salt', { N: 2 ** 16, r: 8, p: 1, dkLen: 32 });
const scr3 = await scryptAsync(Uint8Array.from([1, 2, 3]), Uint8Array.from([4, 5, 6]), {
  N: 2 ** 17,
  r: 8,
  p: 1,
  dkLen: 32,
  onProgress(percentage) {
    console.log('progress', percentage);
  },
  maxmem: 2 ** 32 + 128 * 8 * 1 // N * r * p * 128 + (128*r*p)
});
```

--------------------------------

TITLE: Using Utility Functions in Noble Hashes (TypeScript)
DESCRIPTION: This snippet showcases common utility functions from @noble/hashes/utils.js. It demonstrates bytesToHex for converting a Uint8Array to its hexadecimal string representation and randomBytes for generating cryptographically secure random byte arrays of a specified length. These utilities are essential for handling cryptographic data formats.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/README.md#_snippet_11

LANGUAGE: TypeScript
CODE:
```
import { bytesToHex as toHex, randomBytes } from '@noble/hashes/utils';
console.log(toHex(randomBytes(32)));
```

--------------------------------

TITLE: Using Legacy Hash Functions (SHA-1, MD5, RIPEMD160) in TypeScript
DESCRIPTION: This snippet demonstrates how to import and use legacy hash functions like MD5, RIPEMD160, and SHA-1 from `@noble/hashes/legacy.js`. It shows both the direct hashing method and the streaming API (`create().update().digest()`) for these algorithms. The accompanying text warns against using these 'weak' hash functions in new protocols due to known collision vulnerabilities, though HMAC usage with them is noted as potentially acceptable.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/README.md#_snippet_5

LANGUAGE: TypeScript
CODE:
```
import { md5, ripemd160, sha1 } from '@noble/hashes/legacy.js';
for (let hash of [md5, ripemd160, sha1]) {
  const arr = Uint8Array.from([0x10, 0x20, 0x30]);
  const a = hash(arr);
  const b = hash.create().update(arr).digest();
}
```

--------------------------------

TITLE: Deriving Keys with PBKDF2 in TypeScript
DESCRIPTION: This snippet illustrates the use of PBKDF2 (Password-Based Key Derivation Function 2) from @noble/hashes/pbkdf2.js. It shows both synchronous (pbkdf2) and asynchronous (pbkdf2Async) key derivation, supporting string and Uint8Array inputs for password and salt. PBKDF2 is commonly used for hashing passwords and conforms to RFC 2898.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/README.md#_snippet_8

LANGUAGE: TypeScript
CODE:
```
import { pbkdf2, pbkdf2Async } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';
const pbkey1 = pbkdf2(sha256, 'password', 'salt', { c: 32, dkLen: 32 });
const pbkey2 = await pbkdf2Async(sha256, 'password', 'salt', { c: 32, dkLen: 32 });
const pbkey3 = await pbkdf2Async(sha256, Uint8Array.from([1, 2, 3]), Uint8Array.from([4, 5, 6]), {
  c: 32,
  dkLen: 32,
});
```

--------------------------------

TITLE: Deriving Keys with HKDF in TypeScript
DESCRIPTION: This snippet demonstrates how to use the HKDF (HMAC-based Key Derivation Function) from @noble/hashes/hkdf.js. It shows both the single-step hkdf function and the two-step extract and expand process, which are equivalent. HKDF is used to derive cryptographic keys from a master key and salt, conforming to RFC 5869.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/README.md#_snippet_7

LANGUAGE: TypeScript
CODE:
```
import { hkdf } from '@noble/hashes/hkdf.js';
import { randomBytes } from '@noble/hashes/utils.js';
import { sha256 } from '@noble/hashes/sha2.js';
const inputKey = randomBytes(32);
const salt = randomBytes(32);
const info = 'application-key';
const hk1 = hkdf(sha256, inputKey, salt, info, 32);

// == same as
import { extract, expand } from '@noble/hashes/hkdf.js';
import { sha256 } from '@noble/hashes/sha2.js';
const prk = extract(sha256, inputKey, salt);
const hk2 = expand(sha256, prk, info, 32);
```

--------------------------------

TITLE: Implementing HMAC with SHA256 in TypeScript
DESCRIPTION: This snippet demonstrates how to compute a Hash-based Message Authentication Code (HMAC) using the `hmac` function from `@noble/hashes/hmac.js` with SHA256 as the underlying hash function. It shows two methods: direct computation with `hmac(sha256, key, msg)` and a streaming approach using `hmac.create(sha256, key).update(msg).digest()`. It requires a secret `key` and the `message` to be authenticated, both as `Uint8Array`.

SOURCE: https://github.com/paulmillr/noble-hashes/blob/main/README.md#_snippet_6

LANGUAGE: TypeScript
CODE:
```
import { hmac } from '@noble/hashes/hmac.js';
import { sha256 } from '@noble/hashes/sha2.js';
const key = new Uint8Array(32).fill(1);
const msg = new Uint8Array(32).fill(2);
const mac1 = hmac(sha256, key, msg);
const mac2 = hmac.create(sha256, key).update(msg).digest();
```