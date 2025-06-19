import React, { useEffect, useState } from 'react';
import API from '../Api';

function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    const userID = localStorage.getItem('userID');

    const fetchCart = async () => {
        try {
            const response = await API.get(`/cart/${userID}`);
            setCart(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setCart(null);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleRemove = async (productID) => {
        try {
            setLoading(true);
            await API.delete(`/cart/remove/${productID}`, { data: { userID } });
            await fetchCart();
        } catch (error) {
            console.error('Error removing product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = async () => {
        try {
            setLoading(true);
            const response = await API.post('/cart/buy', { userID });
            alert(`Order placed successfully! Order ID: ${response.data.orderID}`);
            await fetchCart();
        } catch (error) {
            console.error('Error placing order:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl mb-4">Your Cart</h2>

            {cart ? (
                <div>
                    <p>Cart ID: {cart.cartID}</p>
                    <p>Total Amount: ₹{cart.cartAmount}</p>
                    <ul className="my-4">
                        {cart.cartItems.map((item) => (
                            <li key={item.productID} className="mb-4 flex items-center">
                                <img src={"http://localhost:3000/api" + item.product_image} alt={item.name} className="w-16 h-16 object-cover mr-4 rounded" />
                                <div>
                                    <p className="font-bold">{item.name}</p>
                                    <p>₹{item.price}</p>
                                    <button
                                        className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
                                        onClick={() => handleRemove(item.productID)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Cart is empty or not found.</p>
            )}

            <button
                onClick={handleBuy}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={loading}
            >
                {loading ? 'Placing Order...' : 'Buy Now'}
            </button>
        </div>
    );
}

export default Cart;
