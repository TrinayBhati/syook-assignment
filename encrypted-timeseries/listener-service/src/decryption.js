import crypto from 'crypto';

export function createHash(obj) {
    const sortedKeys = Object.keys(obj).sort();
    const sortedObj = {};
    sortedKeys.forEach(key => sortedObj[key] = obj[key]);
    const str = JSON.stringify(sortedObj);
    return crypto.createHash('sha256').update(str).digest('hex');
}

export function decrypt(encryptedText, keyString) {
    const key = crypto.createHash('sha256').update(keyString).digest();
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = Buffer.from(parts[1], 'hex');
    const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
}
