import { useState, useEffect } from 'react';

const useSessionStorage = (key, initialValue) => {
    const [value, setValue] = useState(() => {
        const storedValue = window.sessionStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialValue;
    });

    useEffect(() => {
        window.sessionStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};

export default useSessionStorage;
