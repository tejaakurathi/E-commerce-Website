import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Home from './Pages/Home';
import CategoryPage from './Pages/CategoryPage';
import ProductDetails from './Pages/ProductDetails';
import './index.css'
import Layout from './Layout';
import Order from './Pages/Order';
import Cart from './Pages/CartPage';

const router = createBrowserRouter([
  {
    path: '/', // Default page: Login
    element: <Login />
  },
  {
    path: '/Signup',
    element: <Signup />
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'Home', // Home page after successful login
        element: <Home />,
        children: [
          {
            path: 'CategoryPage',
            element: <CategoryPage />
          }
        ]
      },
      {
        path: 'product/:productId',
        element: <ProductDetails />
      },
          {
        path: 'cart',
        element: <Cart />
      },
      {
        path: 'order/:userid',
        element: <Order />
      }
]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
