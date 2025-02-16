const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
}); //Now, with this we've configured or joined our backend and cloudinary a/c
 
const storage = new CloudinaryStorage({ //now, inside that a/c we're creating a storage point
    cloudinary: cloudinary,
    params: {
      folder: 'WANDERLUST_DEV',
      allowed_formats:["png", "jpeg", "jpg"]
    },
  });

module.exports = {
    storage,
    cloudinary
}
  