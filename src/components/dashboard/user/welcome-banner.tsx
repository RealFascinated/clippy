"use client";

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

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 3600000); // Update greeting every hour

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-2xl select-none">
      Good {greeting}, <span className="font-bold">{username}</span>!
    </span>
  );
}
