import React, { useEffect, useState } from 'react';
import API from '../Api';
import CategoryPage from './CategoryPage';

function Home() {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [selectCategoryId, setSelectCategoryId] = useState(1);
    

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await API.get('/category');
                setCategories(response.data);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories.');
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryId) => {
        setSelectCategoryId(categoryId);
    };


    return (
        <div>
            {/* Categories Section */}
            <div className="bg-gray-100 p-8">
                <h1 className="text-4xl font-bold text-center mb-8">Categories</h1>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <div className="flex justify-center flex-wrap gap-4 max-w-7xl mx-auto px-10">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className="w-[200px] h-[200px] bg-white rounded-lg shadow-md cursor-pointer hover:shadow-xl transition flex flex-col items-center justify-center"
                            onClick={() => handleCategoryClick(category.categoryID)}
                        >
                            <img
                                src={"http://localhost:3000/api" + category.category_image}
                                alt={category.name}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <CategoryPage categoryId={selectCategoryId} />
        </div>
    );
}

export default Home;
