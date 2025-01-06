import React from 'react';
import Home from "./components/Home";
import Login from "./components/Login";
import Register from './components/Register';
import Item from './components/Item';

const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/items',
        element: <Item />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    }
];

export default AppRoutes;
