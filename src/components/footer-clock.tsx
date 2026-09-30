'use client';
import { useEffect, useState } from 'react';

const dateFormat = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', month: 'short', day: 'numeric', year: 'numeric' });
const timeFormat = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true, timeZoneName: 'short' });

export function FooterClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    function sync() {
      clearInterval(timer);
      if (document.hidden) return;
      setNow(new Date());
      timer = setInterval(() => setNow(new Date()), 1000);
    }
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', sync); };
  }, []);

  return <div className="footer-clock">
    <span className="clock-date">{now ? dateFormat.format(now) : 'Toronto, Ontario'}</span>
    <time dateTime={now?.toISOString()}>{now ? timeFormat.format(now) : 'Eastern Time'}</time>
    <span className="clock-location">Toronto, ON · Eastern Time</span>
  </div>;
}
