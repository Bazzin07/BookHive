import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../../context/context';

const Showcase = () => {
    const firebase = useFirebase();
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);

    //Books getting fetch here
    useEffect(() => {
        firebase
            .getBooks()
            .then((fetchedBooks) => {
                if (!fetchedBooks || fetchedBooks.length === 0) {
                    console.error('No books fetched');
                    setBooks([]);
                    return;
                }

                const booksWithImages = fetchedBooks.map((book) => {
                    const images = Array.isArray(book.images)
                        ? book.images.map((key) => localStorage.getItem(key))
                        : [];

                    return { ...book, images };
                });

                setBooks(booksWithImages);
            })
            .catch((err) => {
                console.error('Error fetching books:', err);
                setError('Failed to fetch books. Please try again later.');
            });
    }, [firebase]);

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="min-h-screen md:pl-6 ">
            <section className="text-white flex flex-wrap justify-center md:justify-start p-4 gap-6">
                {books && books.length > 0 ? (
                    books.map((book) => (
                        <div
                            key={book.id}
                            className="book bg-white bg-opacity-30 
                          backdrop-filter backdrop-blur-md 
                          border border-white border-opacity-30 
                          shadow-lg w-[90%] sm:w-[250px] h-[350px] rounded flex flex-col justify-center items-center"
                        >
                            <div className="images flex gap-2 mt-2">
                                {book.images && book.images.length > 0 ? (
                                    book.images.map((image, index) =>
                                        image ? (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Cover ${index}`}
                                                className="book-image"
                                                style={{
                                                    width: '200px',
                                                    height: '150px',
                                                    objectFit: 'fill',
                                                    borderRadius: '5px',
                                                }}
                                            />
                                        ) : (
                                            <p key={index} className="text-red-500">
                                                Image not found
                                            </p>
                                        )
                                    )
                                ) : (
                                    <p>No images available</p>
                                )}
                            </div>
                            <div className="mt-4 text-center">
                                <h2 className="text-lg font-semibold sm:text-xl">
                                    {book.name || 'No Name Provided'}
                                </h2>
                                <p>ISBN: {book.isbnum || 'N/A'}</p>
                                <p>Price: Rs.{book.price || '0.00'}</p>
                            </div>

                            <button
                                onClick={() => navigate(`/books/view/${book.id}`)}
                                className="h-10 w-32 sm:w-40 bg-custom-gradient mt-2 rounded-md text-sm sm:text-base"
                            >
                                Purchase
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No books to display</p>
                )}
            </section>
        </div>
    );
};

export default Showcase;
