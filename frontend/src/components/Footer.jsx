import React from 'react';

const Footer = ({ theme }) => {
    const footerClass = `mt-8 p-4 text-center ${theme ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`;

    const currentYear = new Date().getFullYear();

    return (
        <footer className={footerClass}>
            <p>&copy; {currentYear} SnipSnap</p>
            <p>Designed with ❤️ by FernandoCodes</p>
        </footer>
    );
};

export default Footer;
