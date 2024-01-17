import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const Theme = ({ children }) => {
    const storedTheme = localStorage.getItem('theme');
    const initialTheme = storedTheme ? JSON.parse(storedTheme) : true;

    const [theme, setTheme] = useState(initialTheme);

    const toggleTheme = () => {
        const newTheme = !theme;
        setTheme(newTheme);
        localStorage.setItem('theme', JSON.stringify(newTheme));
    };

    const value = {
        theme,
        toggleTheme,
    };
    
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}
