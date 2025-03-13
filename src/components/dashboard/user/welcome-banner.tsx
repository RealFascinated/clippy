"use client";

import { format } from "date-fns";
import { CalendarDays, Clock } from "lucide-react";
import { useEffect, useState } from "react";

type WelcomeBannerProps = {
  username: string;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  else if (hour < 18) return "Afternoon";
  else return "Evening";
};

export default function WelcomeBanner({ username }: WelcomeBannerProps) {
  const [greeting, setGreeting] = useState(getGreeting());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update greeting every hour
    const greetingInterval = setInterval(() => {
      setGreeting(getGreeting());
    }, 3600000);

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => {
      clearInterval(greetingInterval);
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-background/80 via-background/50 to-background/80 backdrop-blur-sm rounded-xl border border-muted/50 shadow-lg p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Good {greeting}, <span className="text-primary">{username}</span>
        </h1>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            <span>{format(currentTime, "h:mm a")}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4" />
            <span>{format(currentTime, "EEEE, MMMM d, yyyy")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
