import { useState, useEffect } from 'react';

function useTimer(start: Date) {
    const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

    useEffect(() => {
        // Update the elapsed seconds every second
        const intervalId = setInterval(() => {
            const now = new Date();
            const elapsedSeconds = Math.floor((now.getMilliseconds() - start.getMilliseconds()) / 1000);
            setElapsedSeconds(elapsedSeconds);
        }, 1000);

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [start]);

    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;

    return { elapsedSeconds, hours, minutes, seconds };
}

export default useTimer;