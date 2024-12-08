// // // import { join } from 'path';
// // // import admin from 'firebase-admin';
// // // // import serviceAccount from './iot-zebra-a7889-firebase-adminsdk-qtkf6-ce152fea44.json' assert { type: "json" };

// // // // Initialize Firebase Admin SDK
// // // admin.initializeApp({
// // //   credential: admin.credential.cert(serviceAccount),
// // //   storageBucket: 'iot-zebra-a7889.appspot.com', // Correct bucket name format
// // // });

// // // import { initializeApp, applicationDefault } from 'firebase-admin/app';

// // // initializeApp({
// // //     credential: applicationDefault(),
// // //     databaseURL: 'iot-zebra-a7889.appspot.com'
// // // });

// // // const database = admin.database();

// // // // Cloud Function to handle file uploads to Firebase Storage
// // // import { storage } from "firebase-functions";

// // // export const onFileUpload = storage.object().onFinalize(async (object) => {
// // //   const filePath = object.name; // File path in the storage bucket
// // //   const bucketName = object.bucket; // Bucket name
// // //   const fileURL = `https://storage.googleapis.com/${bucketName}/${filePath}`; // Public URL

// // //   // Extract metadata from the file name (assuming the format: YYYY-MM-DD_HH-MM-SS)
// // //   const fileName = filePath.split("/").pop(); // Extract the file name
// // //   const [date, timeWithExt] = fileName.split("_");
// // //   const time = timeWithExt?.replace(/\.[^/.]+$/, ""); // Remove file extension

// // //   if (!date || !time) {
// // //     console.error("File name does not follow the expected format: YYYY-MM-DD_HH-MM-SS");
// // //     return;
// // //   }

// // //   try {
// // //     // Save metadata to Realtime Database
// // //     await database.ref(`data/${date}`).push({
// // //       imageURL: fileURL,
// // //       date,
// // //       time,
// // //       fileName,
// // //     });

// // //     console.log(`Metadata for file ${fileName} successfully stored.`);
// // //   } catch (error) {
// // //     console.error("Error saving metadata to Realtime Database:", error);
// // //   }
// // // });


// // import { join } from 'path';
// // import admin from 'firebase-admin';
// // import * as functions from 'firebase-functions';
// // import serviceAccount from './iot-zebra-a7889-firebase-adminsdk-qtkf6-ce152fea44.json' with { type: "json" };

// // // Initialize Firebase Admin SDK
// // admin.initializeApp({
// //   credential: admin.credential.cert(serviceAccount),
// //   databaseURL: 'https://iot-zebra-a7889-default-rtdb.asia-southeast1.firebasedatabase.app',
// //   storageBucket: 'iot-zebra-a7889.appspot.com', // Ensure this matches your Firebase Storage bucket
// // });

// // // Firebase Realtime Database
// // const database = admin.database();

// // // Cloud Function to handle file uploads to Firebase Storage
// // export const onFileUpload = functions.storage.object().onFinalize(async (object) => {
// //   const filePath = object.name; // File path in the storage bucket
// //   const bucketName = object.bucket; // Bucket name
// //   const fileURL = `https://storage.googleapis.com/${bucketName}/${filePath}`; // Public URL

// //   // Extract metadata from the file name (assuming the format: YYYY-MM-DD_HH-MM-SS)
// //   const fileName = filePath.split("/").pop(); // Extract the file name
// //   const [date, timeWithExt] = fileName.split("_");
// //   const time = timeWithExt?.replace(/\.[^/.]+$/, ""); // Remove file extension

// //   if (!date || !time) {
// //     console.error("File name does not follow the expected format: YYYY-MM-DD_HH-MM-SS");
// //     return;
// //   }

// //   try {
// //     // Save metadata to Realtime Database
// //     await database.ref(`data/${date}`).push({
// //       imageURL: fileURL,
// //       licensePlate,
// //       date,
// //       time,
// //       fileName,
// //     });

// //     console.log(`Metadata for file ${fileName} successfully stored.`);
// //   } catch (error) {
// //     console.error("Error saving metadata to Realtime Database:", error);
// //   }
// // });

// // import { join } from 'path';
// // import admin from 'firebase-admin';
// // import * as functions from 'firebase-functions';
// // import serviceAccount from './iot-zebra-a7889-firebase-adminsdk-qtkf6-ce152fea44.json' with { type: "json" };

// // // Initialize Firebase Admin SDK
// // admin.initializeApp({
// //   credential: admin.credential.cert(serviceAccount),
// //   databaseURL: 'https://iot-zebra-a7889-default-rtdb.asia-southeast1.firebasedatabase.app',
// //   storageBucket: 'iot-zebra-a7889.appspot.com', // Ensure this matches your Firebase Storage bucket
// // });

// // // Firebase Realtime Database
// // const database = admin.database();

// // // Cloud Function to handle file uploads to Firebase Storage
// // export const onFileUpload = functions.storage.object().onFinalize(async (object) => {
// //   console.log("File upload triggered");  // Debug log for function trigger

// //   const filePath = object.name; // File path in the storage bucket
// //   const bucketName = object.bucket; // Bucket name
// //   const fileURL = `https://storage.googleapis.com/${bucketName}/${filePath}`; // Public URL
  
// //   console.log(`File path: ${filePath}`);  // Debug log for file path
// //   console.log(`Bucket name: ${bucketName}`);  // Debug log for bucket name
// //   console.log(`File URL: ${fileURL}`);  // Debug log for generated file URL

// //   // Extract metadata from the file name (assuming the format: YYYY-MM-DD_HH-MM-SS)
// //   const fileName = filePath.split("/").pop(); // Extract the file name
// //   console.log(`Extracted file name: ${fileName}`);  // Debug log for extracted file name

// //   const [date, timeWithExt] = fileName.split("_");
// //   const time = timeWithExt?.replace(/\.[^/.]+$/, ""); // Remove file extension

// //   if (!date || !time) {
// //     console.error("File name does not follow the expected format: YYYY-MM-DD_HH-MM-SS");
// //     return;
// //   }
  
// //   console.log(`Extracted date: ${date}, time: ${time}`);  // Debug log for extracted date and time

// //   try {
// //     // Save metadata to Realtime Database
// //     console.log("Saving metadata to Realtime Database...");
// //     await database.ref(`data/${date}`).push({
// //       imageURL: fileURL,
// //       licensePlate: 'Some License Plate', // Add proper variable or logic here if needed
// //       date,
// //       time,
// //       fileName,
// //     });

// //     console.log(`Metadata for file ${fileName} successfully stored.`);  // Success log
// //   } catch (error) {
// //     console.error("Error saving metadata to Realtime Database:", error);  // Error log
// //   }
// // });




// // // import functions from 'firebase-functions/v1';
// // import * as admin from 'firebase-admin';
// // import * as functions from 'firebase-functions';
// // import serviceAccount from './iot-zebra-a7889-firebase-adminsdk-qtkf6-ce152fea44.json' with { type: "json" };


// // admin.initializeApp({
// //   credential: admin.credential.cert(serviceAccount),
// //   databaseURL: 'https://iot-zebra-a7889-default-rtdb.asia-southeast1.firebasedatabase.app',
// //   storageBucket: 'iot-zebra-a7889.appspot.com', // Ensure this matches your Firebase Storage bucket
// // });

// // const database = admin.database();

// // const JPEG_EXTENSION = '.jpg';

// // export const onFileUpload = functions.storage.object().onFinalize(async (object) => {
// //     console.log("Upload Triggered!")
// //     console.log(object.name);
// // });



// import { onObjectFinalized } from 'firebase-functions/v2/storage';
// import { initializeApp } from 'firebase-admin/app';
// import { getStorage } from 'firebase-admin/storage';
// import * as logger from 'firebase-functions/logger';
// import path from 'path';

// // library for image resizing
// // import sharp from 'sharp';

// initializeApp();

// // scope handler to a specific bucket, using storage options parameter
// export const archivedopts = onObjectFinalized({ bucket: 'iot-zebra-a7889.appspot.com' }, (event) => {
//   const fileBucket = event.data.bucket; // Storage bucket containing the file.
//   const filePath = event.data.name; // File path in the bucket.
//   const contentType = event.data.contentType; // File content type.

//   console.log('Bucket:', fileBucket);
//   console.log('File Path:', filePath);
//   console.log('Content Type:', contentType);
// });
import { initializeApp } from "firebase-admin/app";
import { storage } from "firebase-functions/v1";
import { getStorage } from "firebase-admin/storage";

// Initialize Firebase Admin SDK
initializeApp();

// If you're using a custom bucket, replace 'your-custom-bucket-name' with the actual bucket name
const bucket = getStorage().bucket(); // Custom bucket

export const imageUploadTrigger = storage.object().onFinalize(async (object) => {
    console.log("Storage object finalized");

    const filePath = object.name;
    if (!filePath) {
        console.error("No file path found!");
        return;
    }

    console.log(`File uploaded: ${filePath}`);

    // Example: Check if the uploaded file is an image
    const contentType = object.contentType;
    if (!contentType || !contentType.startsWith("image/")) {
        console.log("The uploaded file is not an image.");
        return;
    }

    console.log(`Image uploaded successfully: ${filePath}`);

    // Optionally: Perform any operation with the custom bucket, e.g., download the file
    const file = bucket.file(filePath);
    console.log(`Performing operation on file: ${file.name}`);
});
