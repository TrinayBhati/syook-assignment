import { createHash } from './decryption.js';

export function validateMessage(decryptedObj) {
    try {
        const { name, origin, destination, secret_key } = decryptedObj;

        if (!name || !origin || !destination || !secret_key) {
            return { isValid: false, message: null };
        }

        const originalMessage = { name, origin, destination };
        const recreatedHash = createHash(originalMessage);

        if (recreatedHash === secret_key) {
            return {
                isValid: true,
                message: { ...originalMessage, secret_key, receivedAt: new Date() }
            };
        }

        return { isValid: false, message: null };
    } catch (error) {
        return { isValid: false, message: null };
    }
}
