// Browser polyfills for Node.js modules
import { Buffer } from 'buffer';

// Make Buffer available globally
if (typeof globalThis.Buffer === 'undefined') {
	globalThis.Buffer = Buffer;
}

// Make global available
if (typeof globalThis.global === 'undefined') {
	globalThis.global = globalThis;
}

// Export to ensure the module is loaded
export { Buffer };