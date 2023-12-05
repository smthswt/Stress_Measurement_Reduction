import React, { useState, createContext, useContext } from 'react';

const ScreenContext = createContext();

export const useScreen = () => useContext(ScreenContext);

export const ScreenProvider = ({ children }) => {
    const [currentScreen, setCurrentScreen] = useState('ScreenOne');

    const switchScreen = (screenName) => {
        setCurrentScreen(screenName);
    };

    return (
        <ScreenContext.Provider value={{ currentScreen, switchScreen }}>
            {children}
        </ScreenContext.Provider>
    );
};
