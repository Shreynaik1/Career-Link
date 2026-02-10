import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Only configure Cloudinary if credentials are provided
const isCloudinaryConfigured = 
	process.env.CLOUDINARY_CLOUD_NAME && 
	process.env.CLOUDINARY_CLOUD_NAME !== "your_cloudinary_cloud_name" &&
	process.env.CLOUDINARY_API_KEY && 
	process.env.CLOUDINARY_API_KEY !== "your_cloudinary_api_key" &&
	process.env.CLOUDINARY_API_SECRET && 
	process.env.CLOUDINARY_API_SECRET !== "your_cloudinary_api_secret";

if (isCloudinaryConfigured) {
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});
	console.log("Cloudinary configured successfully");
} else {
	console.warn("⚠️  Cloudinary not configured. Image uploads will be disabled.");
	console.warn("   To enable image uploads, set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env");
}

// Export a wrapper that checks if Cloudinary is configured
export const uploadImage = async (imageData) => {
	if (!isCloudinaryConfigured) {
		throw new Error("Cloudinary is not configured. Please set up Cloudinary credentials in .env file");
	}
	return await cloudinary.uploader.upload(imageData);
};

export const deleteImage = async (publicId) => {
	if (!isCloudinaryConfigured) {
		console.warn("Cloudinary not configured, skipping image deletion");
		return;
	}
	return await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
