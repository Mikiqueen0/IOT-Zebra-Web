// import React, { useEffect, useState } from "react";
// import app from './configuration'; // Assuming the correct path to your configuration file
// import { get, ref, onValue } from "firebase/database";

// const { database } = app;

// // App.js
// function App() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     // Initialize the Firebase database with the provided configuration
//     // const database = getDatabase(cong);

//     // Reference to the specific collection in the database
//     const collectionRef = ref(database, "Cars");

//   //   get(collectionRef).then((snapshot) => {
//   //     if(snapshot.exists()) {
//   //       const carArray = Object.entries(snapshot.val()).map(([id, data]) => ({
//   //         id,
//   //         ...data,
//   //       }));
//   //       setData(carArray);
//   //     } else {
//   //       console.log("No data available");
//   //     }
//   //   }).catch((error) => {
//   //     console.error(error);
//   //   });
//   // }, []);

//     // Function to fetch data from the database
//     const fetchData = () => {
//       // Listen for changes in the collection
//       onValue(collectionRef, (snapshot) => {
//         const dataItem = snapshot.val();

//         // Check if dataItem exists
//         if (dataItem) {
//           // Convert the object values into an array
//           const displayItem = Object.values(dataItem);
//           setData(displayItem);
//         }
//       });
//     };

//     // Fetch data when the component mounts
//     fetchData();
//   }, []);

//   return (
//     <div>
//       <h1>Data from database:</h1>
//       <div className='grid grid-cols-3 gap-4'>
//         {data.map((car) => (
//           <div key={car.id} className='bg-gray-100 p-4 rounded-g'>
//             <h2 className='text-2xl text-gray-900'>{car.licensePlate}</h2>
//             <p className='text-gray-600'>{car.imageURL}</p>
//             <p className='text-gray-600'>{car.time}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;



import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './App.css';

import app from './configuration'; // Assuming the correct path to your configuration file
import { ref as storageRef, listAll, getDownloadURL } from "firebase/storage";

const { storage } = app;

const App = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesRef = storageRef(storage, "data"); // Path to your storage folder
        const imageList = await listAll(imagesRef); // Get all files in the "data" folder

        // Fetch image URLs and extract date and time from the filenames
        const imageData = await Promise.all(
          imageList.items.map(async (imageItem) => {
            try {
              const imageURL = await getDownloadURL(imageItem); // Get image URL
              const fileName = imageItem.name; // Get the image file name

              // Extract date and time from the filename (assuming the format is YYYY-MM-DD_HH-MM-SS)
              const [date, time] = fileName.split('_'); 
              const formattedDate = date; // "YYYY-MM-DD"
              const formattedTime = time.replace(/-/g, ":"); // "HH:MM:SS"

              return {
                imageURL,
                date: formattedDate,
                time: formattedTime,
              };
            } catch (error) {
              console.error("Error fetching image:", error);
              return null;
            }
          })
        );

        // Filter out any null results (in case of errors fetching image URL)
        setImages(imageData.filter((item) => item !== null));
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const handleDateChange = (date) => {
    const formattedDate = date.toLocaleDateString('en-CA'); // 'en-CA' returns YYYY-MM-DD format
    setSelectedDate(formattedDate);
  };

  const getTileContent = ({ date }) => {
    const formattedDate = date.toLocaleDateString('en-CA'); // Ensure the same format for comparison
    const count = images.filter(item => item.date === formattedDate).length;
    
    return count > 0 ? (
      <div className="absolute top-0 right-0 text-xs text-white font-semibold bg-red-600 px-2 py-1 rounded-full z-10">
        {count}
      </div>
    ) : null;
  };

  const filteredImages = images.filter(item => item.date === selectedDate);

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
            {filteredImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
                {filteredImages.map((image, index) => (
                  <div
                    key={index}
                    className="card bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className="relative">
                      <img
                        src={image.imageURL}
                        alt={`Violation`}
                        className="w-full h-56 object-cover cursor-pointer"
                        onClick={() => handleImageClick(image.imageURL)}
                      />
                    </div>

                    <div className="p-4">
                      <p className="text-lg text-gray-800 font-semibold mb-2">Date: {image.date}</p>
                      <p className="text-gray-600">Time: {fotmatTime(image.time)}</p>
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

