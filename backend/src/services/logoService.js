import { uploadToStorage } from '../config/storage.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to upload Eximpo logo to storage
export const uploadLogoToStorage = async () => {
  try {
    // Check if logo file exists in the project
    const logoPath = path.join(__dirname, '../../assets/logo.png');
    
    try {
      const logoBuffer = await fs.readFile(logoPath);
      const result = await uploadToStorage(
        logoBuffer,
        'eximpo-logo.png',
        'image/png',
        'branding'
      );
      
      console.log('✅ Logo uploaded to storage:', result.url);
      return result.url;
    } catch (fileError) {
      console.log('⚠️ Logo file not found at:', logoPath);
      console.log('Using default logo URL');
      return 'https://sin1.contabostorage.com/98d59d8c643a4403a2dc26a27b37b922:iestorage/branding/eximpo-logo.png';
    }
  } catch (error) {
    console.error('Logo upload error:', error);
    return 'https://sin1.contabostorage.com/98d59d8c643a4403a2dc26a27b37b922:iestorage/branding/eximpo-logo.png';
  }
};

// Get logo URL (cached or from storage)
let cachedLogoUrl = null;

export const getLogoUrl = async () => {
  if (cachedLogoUrl) {
    return cachedLogoUrl;
  }
  
  cachedLogoUrl = await uploadLogoToStorage();
  return cachedLogoUrl;
};

export default {
  uploadLogoToStorage,
  getLogoUrl
};
