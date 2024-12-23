import React, { useState } from 'react';
import { useFirebase } from '../../context/context';
import Navbar from './navbar';

const Listing = () => {
  const firebase = useFirebase();

  const [name, setName] = useState('');
  const [ibnNum, setIbnNum] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [covers, setCovers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (covers.length > 0) {
      const storedImages = await Promise.all( // images are getting stored in local storage
        covers.map((file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              const base64Image = event.target.result;
              const uniqueKey = `coverImage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              localStorage.setItem(uniqueKey, base64Image);
              console.log(`Image stored with key: ${uniqueKey}`, localStorage.getItem(uniqueKey));
              resolve(uniqueKey);
            };
            reader.readAsDataURL(file);
          })
        )
      );


      try {
        await firebase.handleNewListing(name, ibnNum, price, description, storedImages); // data being sent to firebase
        alert('Listing created successfully!');
        window.location.reload();
      } catch (error) {
        console.error('Error creating listing:', error);
      }
    } else {
      alert('Please upload at least one cover image!');
    }
  };

  return (
    <div>
      <Navbar />
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <h1 className="text-white font-semibold text-2xl sm:text-3xl md:text-4xl text-center pt-4">
        Enter the Book Details
      </h1>
      <div
        className="w-full max-w-full sm:max-w-md p-6 sm:p-10 rounded-lg 
                    bg-white bg-opacity-30 
                    backdrop-filter backdrop-blur-md 
                    border border-white border-opacity-30 
                    shadow-lg my-6"
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex flex-col gap-4">
            <label htmlFor="Bookname" className="block text-base sm:text-lg md:text-xl font-medium text-white">
              Book Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              id="book"
              placeholder="Enter the book name"
              className="w-full px-4 py-2 border rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         bg-white bg-opacity-80 text-gray-800 placeholder-gray-500"
            />

            <label htmlFor="ibnNum" className="block text-base sm:text-lg md:text-xl font-medium text-white">
              Ibn Number
            </label>
            <input
              onChange={(e) => setIbnNum(e.target.value)}
              value={ibnNum}
              type="text"
              id="ibnNum"
              placeholder="Enter IbnNumber"
              className="w-full px-4 py-2 border rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         bg-white bg-opacity-80 text-gray-800 placeholder-gray-500"
            />

            <label htmlFor="Price" className="block text-base sm:text-lg md:text-xl font-medium text-white">
              Price
            </label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              type="text"
              id="Price"
              placeholder="Enter the Book Price"
              className="w-full px-4 py-2 border rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         bg-white bg-opacity-80 text-gray-800 placeholder-gray-500"
            />

            <label htmlFor="Description" className="block text-base sm:text-lg md:text-xl font-medium text-white">
              Description
            </label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              id="Description"
              placeholder="Enter the Description"
              rows="3"
              className="w-full px-4 py-2 border rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         bg-white bg-opacity-80 text-gray-800 placeholder-gray-500"
            ></textarea>

            <label htmlFor="cover" className="block text-base sm:text-lg md:text-xl font-medium text-white">
              Upload the Pics
            </label>
            <input
              onChange={(e) => setCovers([...covers, ...Array.from(e.target.files)])}
              type="file"
              id="cover"
              multiple
              className="w-full px-4 py-2 border rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         bg-white bg-opacity-80 text-gray-800 placeholder-gray-500"
            />

            <button
              type="submit"
              className="w-full h-12 bg-custom-gradient border-none rounded-md text-white mt-4 
                         hover:opacity-90 transition duration-300"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Listing;

