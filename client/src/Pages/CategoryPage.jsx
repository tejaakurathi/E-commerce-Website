import React, { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import API from '../Api';

function CategoryPage({categoryId}) {
    //const { categoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                
                const categoryResponse = await API.get(`/category/${categoryId}`);
                setCategoryName(categoryResponse.data.name); 

                const response = await API.get(`/products/${categoryId}`)
                setProducts(response.data);
            } catch (err) {
                console.error('Error fetching products:', err);
            }
        };

        fetchProducts();
    }, [categoryId]);

    const handleProductClick = (categoryId) => {
        navigate(`/product/${categoryId}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-bold text-center mb-8">Products: {categoryName}</h1>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {products.map((product) => (
                        <div
                            key={product.productID}
                            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition"
                            onClick={() => handleProductClick(product.productID)}
                        >
                            <img
                                src={"http://localhost:3000/api" + product.product_image}
                                alt={product.name}
                                className="pr-auto w-auto h-40 object-cover mb-4 rounded"
                            />
                            <h2 className="text-xl font-semibold">{product.name}</h2>
                            <p className="text-gray-700 mt-2">Price: ₹{product.price}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No products found in this category.</p>
            )}
        </div>
    );
}

export default CategoryPage;
