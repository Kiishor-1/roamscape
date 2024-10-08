import CryptoJS from 'crypto-js';

const generateSignature = (timestamp) => {
  const apiSecret = import.meta.env.VITE_REACT_APP_API_SECRET; // Ensure this is securely set
  const paramsToSign = `timestamp=${timestamp}${apiSecret}`; // Combine timestamp and secret

  // Generate SHA-1 signature
  const signature = CryptoJS.SHA1(paramsToSign).toString();

  return signature;
};




export const uploadImageToCloudinary = async (file) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000); // Example: timestamp for signature
    const signature = generateSignature(timestamp);  // Generate signature

    const formData = new FormData();
    formData.append('file', file);
    formData.append('timestamp', timestamp);
    formData.append('api_key', import.meta.env.VITE_REACT_APP_API_KEY);
    formData.append('signature', signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_REACT_APP_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url; // Return the URL of the uploaded image
    } else {
      throw new Error('Failed to upload image to Cloudinary');
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};
