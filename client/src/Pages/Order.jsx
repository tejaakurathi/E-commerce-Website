import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../Api'; // Using your custom API instance

function Order() {
    const { userid } = useParams(); // Getting userID from the URL
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if ( userid === 'null') {  // Safe check
        setError('Not Logged In,Please Log In');
        setLoading(false);
        return; // Stop the API call
    }
        const fetchOrders = async () => {
            try {
                const response = await API.get(`/order/${userid}`); // Call using your Api instance
                setOrders(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load orders.');
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userid]);

    if (loading) return <div className="p-8 text-xl">Loading orders...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
            {orders.length > 0 ? (
                <ul className="space-y-4">
                    {orders.map((order) => (
                        <li key={order.orderID} className="border p-4 rounded shadow">
                            <p><strong>Order ID:</strong> {order.orderID}</p>
                            <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p> {/* ✅ Date Display */}
                            <p><strong>Total Amount:</strong> ₹{order.orderAmount}</p>
                            <div className="mt-4">
                                <strong>Products:</strong>
                                <ul className="ml-4 space-y-4">
                                    {order.products.map((product, index) => (
                                        <li key={index} className="flex items-center space-x-6 border p-4 rounded">
                                            <img
                                                src={"http://localhost:3000/api" + product.image}
                                                alt={product.name}
                                                className="w-30 h-30 object-cover rounded "
                                            />
                                            <div>
                                                <p className="font-semibold">{product.name}</p>
                                                <p>Quantity: 1</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}

                </ul>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
}

export default Order;