import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirebase } from '../context/context';
import Navbar from './dashboard/navbar';

const View = () => {
  const firebase = useFirebase();
  const params = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [qty , setQty] = useState(1);

  useEffect(() => {
    if (params.bookId) {
      firebase
        .fetchBook(params.bookId)
        .then((doc) => {
          if (doc.exists()) {
            const bookData = doc.data();
            setBook(bookData);

            const storedImages = Array.isArray(bookData.images)
              ? bookData.images.map((key) => localStorage.getItem(key))
              : [];
            setImages(storedImages);
          } else {
            console.error('No such book found!');
            setError('Book not found.');
          }
        })
        .catch((err) => {
          console.error('Error fetching book:', err.message);
          setError('Failed to fetch book. Please try again later.');
        });
    }
  }, [firebase, params.bookId]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!book) {
    return <p>Loading book details...</p>;
  }

  const placeOrder = async () => {
    if (!qty || qty <= 0) {
      console.error("Invalid quantity");
      alert("Please enter a valid quantity greater than 0");
      return;
    }
    try {
      const result = await firebase.fetchOrders(params.bookId, images, parseInt(qty));
      alert('Order placed successfully successfully!');
      console.log("Order placed successfully:", result);
    } catch (error) {
      console.error("Error placing order:", error.message);
      alert("Failed to place the order. Please try again.");
    }
  };
  
  return (
    <div>
      <Navbar />
      <div className="flex flex-col min-h-screen p-4 md:pl-6">
        <div
          className="bg-white bg-opacity-30 
                      backdrop-filter backdrop-blur-md 
                      border border-white border-opacity-30 
                      shadow-lg w-full max-w-5xl rounded-lg flex flex-col md:flex-row text-white p-6"
        >
          
          <div className="flex justify-center items-center w-full md:w-[50%] mb-6 md:mb-0">
            {images.length > 0 ? (
              <img
                src={images[0]}
                alt="Book Cover"
                className="rounded-md object-cover w-[250px] h-[250px] md:w-[350px] md:h-[350px]"
              />
            ) : (
              <p>No images available</p>
            )}
          </div>

        
          <div className="flex flex-col justify-start w-full md:w-[50%] pl-0 md:pl-8">
            <h1 className="text-2xl md:text-3xl mb-6 text-center md:text-left">
              Book Details
            </h1>
            <div className="flex flex-col gap-2 text-base md:text-lg">
              <p>
                <strong>Name:</strong> {book.name || 'Unnamed Book'}
              </p>
              <p>
                <strong>ISBN:</strong> {book.isbnum || 'N/A'}
              </p>
              <p>
                <strong>Price:</strong> Rs. {book.price || '0.00'}
              </p>
              <p>
                <strong>Description:</strong> {book.description || 'N/A'}
              </p>
              <label 
              htmlFor="qty" 
              className="block text-sm font-medium text-white mb-1"
            >
              Quantity
            </label>
            <input
              onChange={e => setQty(e.target.value)}
              value={qty}  
              type="number"
              id="qty"
              placeholder='Enter Quantity'
              className=" px-4 py-2 border rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         bg-white bg-opacity-80 text-gray-800 placeholder-gray-500"
            />
            </div>
          </div>
        </div>
        <div className='w-full md:w-[1024px] flex justify-center'>
        <button onClick={placeOrder} variant="success" className='w-[150px] h-12 bg-custom-gradient border rounded text-white mt-4'>Buy</button></div>
      </div>
    </div>
  );
};

export default View;
