import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import { getStorage } from 'firebase-admin/storage';
import logger from 'firebase-functions/logger';
import axios from 'axios';
import serviceAccount from './iot-zebra-a7889-firebase-adminsdk-qtkf6-fecee77a59.json' with { type: 'json' };

initializeApp({
    credential: cert(serviceAccount),  // Automatically use default credentials
    databaseURL: 'https://iot-zebra-a7889-default-rtdb.asia-southeast1.firebasedatabase.app',
    storageBucket: 'iot-zebra-a7889.firebasestorage.app' // Ensure this matches your Firebase Storage bucket
});

export const onFileUpload = onObjectFinalized({ cpu: 2 }, async (event) => {
    const filePath = event.data.name; // File path in the bucket.
    const contentType = event.data.contentType; // File content type.

    if (!contentType.startsWith("image/")) {
        logger.error("Invalid file type: ", contentType);
        return;
    }

    // Extract metadata from the file name (assuming the format: YYYY-MM-DD_HH-MM-SS)
    const fileName = filePath.split("/").pop(); // Extract the file name
    const [date, timeWithExt] = fileName.split("_");
    const time = timeWithExt?.replace(/\.[^/.]+$/, ""); // Remove file extension

    if (!date || !time) {
        logger.error("File name does not follow the expected format: YYYY-MM-DD_HH-MM-SS");
        return;
    }

    // Log the data to check
    logger.log(`File uploaded! Path: ${filePath}, Content Type: ${contentType}`);
    logger.log(`Image Date: ${date}, Time: ${time}, File Name: ${fileName}`);

    // Save the data to Firebase Realtime Database
    const database = getDatabase();
    const dataRef = database.ref('Cars'); // Reference to the 'uploadedFiles' node in the Realtime Database

    // Get a reference to Firebase Storage
    const storage = getStorage();
    const fileRef = storage.bucket().file(filePath);

    try {
        const snapshot = await dataRef.once('value');
        const carsData = snapshot.val();

        const isDuplicate = carsData
            ? Object.values(carsData).some((car) => car.filePath === filePath)
            : false;

        if (isDuplicate) {
            logger.log(`Duplicate entry detected for filePath: ${filePath}. Skipping save.`);
            return; // Exit if duplicate is found
        }

        // Get a signed URL for the file from Firebase Storage
        const signedUrls = await fileRef.getSignedUrl({
            action: 'read', // You want to allow read access to the file
            expires: '03-09-2491' // Set an expiration date far in the future
        });

        const downloadURL = signedUrls[0]; // Extract the download URL from the array

        let data = { plate_number: "No plate detected", province: "No province detected", raw_province: "No raw province detected" };

        try {
            const response = await axios.post("https://fastapi-iot-560924732058.asia-southeast1.run.app/process-image/", { image_path: downloadURL });
            data = response.data;
            logger.log("Received response from FastAPI:", data);
        } catch (error) {
            logger.error("Error calling FastAPI:", error);
        }

        const plateNumber = data.plate_number || "No plate detected";
        const province = data.province || "No province detected";
        const rawProvince = data.raw_province || "No raw province detected";

        // Save the file data to the database
        await dataRef.push({
            filePath,
            date,
            time,
            fileName,
            plateNumber,
            province,
            rawProvince
        });

        logger.log(`Metadata for file ${fileName} successfully stored.`);
        logger.log("Data saved to Realtime Database!");
    } catch (error) {
        logger.error("Error saving metadata to Realtime Database:", error);
    }
});
