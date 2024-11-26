import { useState, useEffect } from 'react';

export default function ProgressBar({ timer }) {
    const [remainingTime, setRemainingTime] = useState(timer); // initial time bec time pick below

    useEffect(() => {
    //setInterval, kinda relate to setTimeout, define a function that will be execute every milli secs
    const interval = setInterval(() => {
      console.log('INTERVAL');
      setRemainingTime((prevTime) => prevTime - 10); // 3000 , 2990, so on
    }, 10);

    //return clean up function, to avoid infinite loop
    return () => {
      clearInterval(interval);
    };
  }, []);

  return <progress value={remainingTime} max={timer} />;
}