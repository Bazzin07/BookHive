import React, { useEffect, useState } from 'react';
import { useFirebase } from '../../context/context';
import Navbar from './navbar';

const Orders = () => {
    const firebase = useFirebase();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const fetchedOrders = await firebase.getOrders();
                setOrders(fetchedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [firebase]);

    if (loading) {
        return <p className="text-white text-center">Loading orders...</p>;
    }

    if (orders.length === 0) {
        return <p className="text-white text-center">No orders found.</p>;
    }

    return (
        <div className="min-h-screen md:pl-6">
            <Navbar />
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-semibold text-white mb-6 text-center sm:text-left">
                    Your Orders
                </h1>
                <section className="text-white flex flex-wrap gap-6 justify-center sm:justify-start items-center">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="order-card bg-white bg-opacity-30 
                              backdrop-filter backdrop-blur-md 
                              border border-white border-opacity-30 
                              shadow-lg w-[90%] sm:w-[250px] h-auto p-4 rounded flex flex-col justify-start items-center"
                        >
                            <div className="images flex justify-center items-center w-full">
                                {order.images && order.images.length > 0 ? (
                                    order.images.map((image, index) =>
                                        image ? (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Cover ${index}`}
                                                className="order-image rounded-md"
                                                style={{
                                                    width: '200px',
                                                    height: '150px',
                                                    objectFit: 'fill',
                                                }}
                                            />
                                        ) : (
                                            <p key={index} className="text-red-500">
                                                Image not found
                                            </p>
                                        )
                                    )
                                ) : (
                                    <p className="text-sm">No images available</p>
                                )}
                            </div>
                            <div className="mt-4 text-center">
                                <h2 className="text-lg sm:text-xl font-semibold">
                                    {order.bookName || 'Book Name'}
                                </h2>
                                <p className="text-sm sm:text-base">Quantity: {order.Quantity}</p>
                                <p className="text-sm sm:text-base">
                                    Price: Rs.{order.price || '0.00'}
                                </p>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default Orders;
