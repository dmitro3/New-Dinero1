import React from 'react';
import FlipCountdown from '@rumess/react-flip-countdown';

function CountdownTimer({ durationInSeconds, onExpire }) {

  const targetTime = new Date(Date.now() + durationInSeconds * 1000);

  return (
    <div className="countdown-timer">
      <FlipCountdown
        endAt={targetTime.toISOString()} 
        hideYear
        hideMonth
        hideDay
        onTimeUp={onExpire}
        theme="dark"
        hourTitle="Hours"
        minuteTitle="Minutes"
        secondTitle="Seconds"
        className="custom-countdown"
      />
    </div>
  );
}

export default CountdownTimer;
