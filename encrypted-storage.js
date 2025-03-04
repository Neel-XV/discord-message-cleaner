// Utility functions for securely storing the Discord token
const encryptedStorage = {
  // Generate a random encryption key
  generateKey: async function() {
    // Generate a random key for encryption
    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256
      },
      true, // extractable
      ["encrypt", "decrypt"]
    );
    
    // Export the key to store it
    const exportedKey = await window.crypto.subtle.exportKey("raw", key);
    const keyString = this._arrayBufferToBase64(exportedKey);
    
    // Store the key in local storage
    localStorage.setItem('discord_cleaner_key', keyString);
    
    return key;
  },
  
  // Get the encryption key (or generate if doesn't exist)
  getKey: async function() {
    const storedKey = localStorage.getItem('discord_cleaner_key');
    
    if (storedKey) {
      // Import the existing key
      const keyBuffer = this._base64ToArrayBuffer(storedKey);
      return await window.crypto.subtle.importKey(
        "raw",
        keyBuffer,
        {
          name: "AES-GCM",
          length: 256
        },
        false, // not extractable again
        ["encrypt", "decrypt"]
      );
    } else {
      // Generate a new key if none exists
      return await this.generateKey();
    }
  },
  
  // Encrypt text with the key
  encrypt: async function(text) {
    try {
      const key = await this.getKey();
      
      // Create an initialization vector
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
      // Encode the text
      const encodedText = new TextEncoder().encode(text);
      
      // Encrypt the data
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv
        },
        key,
        encodedText
      );
      
      // Combine the IV and encrypted data
      const combinedData = new Uint8Array(iv.length + encryptedData.byteLength);
      combinedData.set(iv, 0);
      combinedData.set(new Uint8Array(encryptedData), iv.length);
      
      // Convert to a base64 string for storage
      return this._arrayBufferToBase64(combinedData);
    } catch (error) {
      console.error("Encryption error:", error);
      return null;
    }
  },
  
  // Decrypt text with the key
  decrypt: async function(encryptedText) {
    try {
      const key = await this.getKey();
      
      // Convert from base64 to array buffer
      const combinedData = this._base64ToArrayBuffer(encryptedText);
      
      // Extract the IV and encrypted data
      const iv = combinedData.slice(0, 12);
      const encryptedData = combinedData.slice(12);
      
      // Decrypt the data
      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: new Uint8Array(iv)
        },
        key,
        encryptedData
      );
      
      // Decode and return the decrypted text
      return new TextDecoder().decode(decryptedData);
    } catch (error) {
      console.error("Decryption error:", error);
      return null;
    }
  },
  
  // Utility: Convert ArrayBuffer to Base64 string
  _arrayBufferToBase64: function(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  },
  
  // Utility: Convert Base64 string to ArrayBuffer
  _base64ToArrayBuffer: function(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
};