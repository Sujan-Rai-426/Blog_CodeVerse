import React, { useState, useEffect } from 'react';

const Typing_Effect = ({ words = ["Hello!", "Welcome.", "Enjoy your stay!"], speed = 100, eraseSpeed = 50, waitTime = 2000 }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [wordIndex, setWordIndex] = useState(0); // Which word in the array
    const [charIndex, setCharIndex] = useState(0); // Which character in the current word
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentWord = words[wordIndex];
        
        // Determine the timing: slower for typing, faster for erasing
        const timeoutDuration = isDeleting ? eraseSpeed : speed;

        const handleTyping = () => {
            // 1. Typing: Add next character
            if (!isDeleting && charIndex < currentWord.length) {
                setDisplayedText((prev) => prev + currentWord.charAt(charIndex));
                setCharIndex((prev) => prev + 1);
            } 
            // 2. Deleting: Remove last character
            else if (isDeleting && charIndex > 0) {
                setDisplayedText((prev) => prev.slice(0, -1));
                setCharIndex((prev) => prev - 1);
            } 
            // 3. Pause at the end of the word before deleting
            else if (!isDeleting && charIndex === currentWord.length) {
                setTimeout(() => setIsDeleting(true), waitTime);
            }
            // 4. Move to the next word once deleted
            else if (isDeleting && charIndex === 0) {
                setIsDeleting(false);
                setWordIndex((prev) => (prev + 1) % words.length);
            }
        };

        const timeout = setTimeout(handleTyping, timeoutDuration);

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, wordIndex, words, speed, eraseSpeed, waitTime]);

    return (
        <span style={{ 
            fontFamily: 'monospace', 
            borderRight: '2px solid gray',
            paddingRight: '4px' 
        }}>
            {displayedText}
        </span>
    );
};

export default Typing_Effect;