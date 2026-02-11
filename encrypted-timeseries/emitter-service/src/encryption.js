import crypto from 'crypto';

export function createHash(obj) {
    const sortedKeys = Object.keys(obj).sort();
    const sortedObj = {};
    sortedKeys.forEach(key => sortedObj[key] = obj[key]);
    const str = JSON.stringify(sortedObj);
    return crypto.createHash('sha256').update(str).digest('hex');
}

export function encrypt(text, keyString) {
    const key = crypto.createHash('sha256').update(keyString).digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}
