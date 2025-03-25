"use client";

import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollArrow() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition < 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 100,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToContent}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 focus:outline-none"
    >
      <ArrowDown className="w-6 h-6 text-muted-foreground/40 hover:text-muted-foreground animate-bounce transition-colors" />
    </button>
  );
}
