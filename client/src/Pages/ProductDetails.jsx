import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../Api';

function ProductDetails() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await API.get(`/product/${productId}`);
                setProduct(response.data);
            } catch (err) {
                console.error('Failed to fetch product details:', err);
                setError('Failed to fetch product details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleAddToCart = async () => {
        try {
            const userID = localStorage.getItem('userID');
            if (!userID) {
                alert('User not logged in. Please log in to add products to cart.');
                navigate('/'); // Redirect to login page
                return;
            }

            await API.post(`/cart/add/${product.productID}`, { userID });
            alert('Product added to cart successfully!');
        } catch (err) {
            console.error('Error adding to cart:', err);
            alert('Failed to add product to cart.');
        }
    };

    const handleBuyClick = async () => {
        try {
            const userID = localStorage.getItem('userID');
            if (!userID) {
                alert('User not logged in. Please log in to place an order.');
                navigate('/'); // Redirect to login page
                return;
            }

            const orderPayload = {
                userID,
                products: [{ productID: product.productID, quantity: 1 }],
                totalAmount: product.price,
            };

            await API.post('/order', orderPayload);
            alert('Order placed successfully!');
            // You can navigate to the orders page or show confirmation here if needed
            // navigate('/order');
        } catch (err) {
            console.error('Order failed:', err);
            alert('Failed to place the order. Please try again.');
        }
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
            <img src={"http://localhost:3000/api" + product.product_image} alt={product.name} className="w-50 h-50 mb-4" />
            <p className="mb-2"><strong>Price:</strong> ₹{product.price}</p>

            <div className="flex space-x-4">
                <button
                    onClick={handleAddToCart}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                >
                    Add to Cart
                </button>

                <button
                    onClick={handleBuyClick}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                >
                    Buy Now
                </button>
            </div>
        </div>
    );
}

export default ProductDetails;
