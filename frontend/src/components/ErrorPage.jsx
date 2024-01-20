import React from 'react';

const ErrorPage = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
                <p className="text-2xl font-bold mb-4">Page Not Found</p>
                <p className="text-gray-600">Sorry, the page you are looking for might be unavailable or does not exist.</p>
                <a href="/" className="mt-4 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded">Go Back Home</a>
            </div>
        </div>

    );
};

export default ErrorPage;
