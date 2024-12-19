import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './App.css';

import app from './configuration'; // Assuming the correct path to your configuration file
import { ref as sRef, getDownloadURL } from 'firebase/storage';
import { ref, onValue } from "firebase/database";


const { database, storage } = app;
const App = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Get a reference to the 'Cars' node in your Firebase Realtime Database
    const databaseRef = ref(database, "Cars");

    // Set up a real-time listener
    const unsubscribe = onValue(
      databaseRef,
      async (snapshot) => {
        if (snapshot.exists()) {
          console.log("Real-time data update!");

          // Get all the image data from the snapshot
          const dataList = snapshot.val();

          const loadedData = await Promise.all(
            Object.keys(dataList).map(async (key) => {
              const { filePath, date, time, plateNumber, province, rawProvince } = dataList[key];

              const storageRef = sRef(storage, filePath);
              const imageURL = await getDownloadURL(storageRef);

              // Convert the time from HH-MM-SS format to HH:MM:SS
              const formattedTime = time.replace(/-/g, ":");
              // console.log(imageURL);

              return {
                id: key,
                imageURL,
                date,
                time: formattedTime,
                plateNumber,
                province,
                rawProvince
              };
            })
          );

          // Update the state with the formatted image data
          setData(loadedData);
        } else {
          console.log("No images found in the database");
          setData([]); // Clear the state if no data exists
        }
      },
      (error) => {
        console.error("Error listening to real-time updates:", error);
      }
    );

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleDateChange = (date) => {
    const formattedDate = date.toLocaleDateString('en-CA'); // 'en-CA' returns YYYY-MM-DD format
    setSelectedDate(formattedDate);
  };

  const getTileContent = ({ date }) => {
    const formattedDate = date.toLocaleDateString('en-CA'); // Ensure the same format for comparison
    const count = data.filter(item => item.date === formattedDate).length;
    
    return count > 0 ? (
      <div className="absolute top-0 right-0 text-xs text-white font-semibold bg-red-600 px-2 py-1 rounded-full z-10">
        {count}
      </div>
    ) : null;
  };

  const filteredImages = data.filter(item => item.date === selectedDate);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const fotmatTime = (fileName) => {
     // time format is 'HH:MM:SS.jpg' in the string
    const [hours, minutes, seconds] = fileName.split(".")[0].split(":").map(Number);
    return `${hours}:${minutes}:${seconds}`
  };

  const formatTimeTo12Hour = (filename) => {
    // time format is 'HH:MM:SS.jpg' in the string
    const [hours, minutes, seconds] = filename.split(".")[0].split(":").map(Number); // Split by hyphen and convert to numbers

    console.log(hours, minutes, seconds);
    
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      return "Invalid Time";
    }
  
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for AM
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${period}`;
  };

  return (
    <div className="App font-sans p-5 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Traffic Light Violation Tracker</h1>
      <div className="flex justify-center mb-8">
        <Calendar
          onChange={handleDateChange}
          tileContent={getTileContent}
          className="react-calendar shadow-md rounded-lg bg-white"
          tileClassName="relative flex items-center justify-center h-16 w-16 text-lg"
        />
      </div>

      <div className="details">
        {selectedDate && (
          <>
            <h2 className="text-xl font-semibold mb-6 text-center text-gray-700">
              Violations on {selectedDate}
            </h2>
            {data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
                {filteredImages.map((item, index) => (
                  <div
                    key={index}
                    className="card bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className="relative">
                      <img
                        src={item.imageURL}
                        alt={``}
                        className="w-full h-56 object-cover cursor-pointer"
                        onClick={() => handleImageClick(item.imageURL)}
                      />
                    </div>

                    <div className="p-4">
                      <p className="text-lg text-gray-900 font-bold mb-2">Plate Number: {item.plateNumber}</p>
                      <p className="text-lg text-gray-900 font-bold mb-2">Plate Province: {item.province}</p>
                      <p className="text-lg text-gray-800 font-semibold mb-2">Date: {item.date}</p>
                      <p className="text-gray-600">Time: {fotmatTime(item.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No recorded violations</p>
            )}
          </>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20">
          <div className="relative max-w-full max-h-full p-4">
            <img
              src={selectedImage}
              alt="Selected violation"
              className="max-w-screen-lg max-h-screen object-contain"
            />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white text-black rounded-full p-3 text-[15px] hover:bg-gray-300 focus:outline-none"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

