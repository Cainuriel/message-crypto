// Simple test endpoint to check server setup
import { json } from '@sveltejs/kit';

export async function GET() {
    try {
        // Test basic imports
        const { ethers } = await import('ethers');
        const detectProvider = await import('@metamask/detect-provider');
        
        return json({
            success: true,
            message: 'Server APIs are working',
            imports: {
                ethers: !!ethers,
                detectProvider: !!detectProvider
            }
        });
    } catch (error) {
        return json({
            success: false,
            error: error.message,
            stack: error.stack
        });
    }
}