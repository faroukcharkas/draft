import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@uidotdev/usehooks';

function setTabName(title: string) {
    document.title = `${title} - Pentip`;
}

export default function Title({ onTitleChange, title: initialTitle }: { onTitleChange: (title: string) => void, title: string }) {
    const [title, setTitle] = useState(initialTitle);
    const debouncedTitle = useDebounce(title, 1000);

    useEffect(() => {
        setTabName(debouncedTitle);
        onTitleChange(debouncedTitle);
    }, [debouncedTitle, onTitleChange]);

    const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    }, []);
    
    return (
        <input 
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled Document"
            className="text-3xl font-bold z-10 bg-transparent outline-none focus:border-b-2 focus:border-gray-300 transition-all duration-200 ease-in-out"
        />
    );
}