import React from 'react';

const Footer = ({ theme }) => {
    const footerClass = `mt-8 p-4 text-center ${theme ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`;

    return (
        <footer className={footerClass}>
            <p>&copy; 2024 Your Website Name</p>
            <p>Designed with ❤️ by Your Name</p>
        </footer>
    );
};

export default Footer;
