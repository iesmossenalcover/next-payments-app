import React, { useState, useEffect } from 'react';

interface TimerProps {
    startDate: Date;
}

function Timer({ startDate }: TimerProps) {
    const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

    useEffect(() => {
        // Update the elapsed seconds every second
        const intervalId = setInterval(() => {
            const now = new Date();
            const elapsedSeconds = Math.floor((now.getMilliseconds() - startDate.getMilliseconds()) / 1000);
            setElapsedSeconds(elapsedSeconds);
        }, 1000);

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [startDate]);

    // Calculate hours, minutes, and seconds
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;

    return (
        <div>
            <h1>Timer</h1>
            <p>Time Elapsed: {hours} hours, {minutes} minutes, {seconds} seconds</p>
        </div>
    );
}

export default Timer;