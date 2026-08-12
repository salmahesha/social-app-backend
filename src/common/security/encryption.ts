import CryptoJS from "crypto-js";

export function encrypt({ text, key }: { text: string; key: string }): string {
    return CryptoJS.AES.encrypt(text, String(key)).toString();
}

export function decrypt({ cipheredText, key }: { cipheredText: string; key: string }): string {
    try {
        const bytes = CryptoJS.AES.decrypt(cipheredText, String(key));
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        
        if (!decryptedText) {
            console.error("Decryption resulted in an empty string. Check your ENCRYPTION_KEY.");
        }
        
        return decryptedText;
    } catch (error) {
        console.error("Decryption failed:", error);
        return "";
    }
}