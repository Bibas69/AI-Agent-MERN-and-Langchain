import React, { useEffect, useState } from 'react'


const CountdownCircle = ({endTime, startTime}) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const start = new Date(startTime).getTime();
            const end = new Date(endTime).getTime();
            const remainingTime = end-now;
            if(remainingTime<0){
                setTimeLeft(0);
                setProgress(0);
                clearInterval(timer);
            }
            else{
                setTimeLeft(remainingTime);
                const totalDuration = end-start;
                const remainingPercent = (remainingTime/totalDuration)*100
                setProgress(remainingPercent)
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [endTime, startTime]);

    const hours = Math.floor(timeLeft/1000/60/60);
    const minutes = Math.floor((timeLeft/1000/60)%60);
    const seconds = Math.floor((timeLeft/1000)%60);

  return (
    <div>
        <div className='w-24 h-6 rounded-sm flex items-center justify-center' style={{
          background: `conic-gradient(#00ffcc ${progress * 3.6}deg, #1e293b ${progress * 3.6}deg)`,
          transition: "background 0.3s linear",
        }}>
            <div className='w-23 h-5 bg-zinc-600 rounded-sm flex items-center justify-center'>
                <p className='text-white'>{`${hours}:${minutes}:${seconds}`}</p>
            </div>
        </div>
    </div>
  )
}

export default CountdownCircle