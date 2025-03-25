import { env } from "@/lib/env";
import { cn } from "@/lib/utils/utils";
import NotSignedIn from "@/providers/auth/not-signed-in";
import SignedIn from "@/providers/auth/signed-in";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import SidebarToggle from "./dashboard/sidebar/sidebar-toggle";
import ProfileButton from "./user/profile-button";

type Item = {
  name: string;
  icon?: ReactNode;
  href: string;
  className?: string;
};

const items: Item[] = [];

function NavButton({ name, icon, href, className }: Item) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors",
        className
      )}
      prefetch={false}
    >
      {icon}
      {name}
    </Link>
  );
}

export default async function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-[var(--header-height)] items-center justify-center">
        <div className="flex w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Sidebar Toggle */}
            <SidebarToggle />

            {/* Website */}
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-foreground/90 hover:text-foreground transition-colors"
              prefetch={false}
              draggable={false}
            >
              <Image
                src={env.NEXT_PUBLIC_WEBSITE_LOGO}
                alt={`${env.NEXT_PUBLIC_WEBSITE_NAME} Logo`}
                width={20}
                height={20}
                draggable={false}
                unoptimized
              />
              <span className="max-w-[100px] sm:max-w-none truncate">
                {env.NEXT_PUBLIC_WEBSITE_NAME}
              </span>
            </Link>

            {/* Links */}
            <div className="hidden sm:flex gap-4 items-center">
              {items.map((item, index) => {
                return (
                  <NavButton
                    key={index}
                    name={item.name}
                    icon={item.icon}
                    href={item.href}
                    className={item.className}
                  />
                );
              })}
            </div>
          </div>

          {/* Auth / Dashboard */}
          <div className="flex items-center gap-2">
            <NotSignedIn>
              <NavButton
                name="Login"
                className="h-9 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                href="/auth/login"
              />
            </NotSignedIn>
            <SignedIn>
              <ProfileButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
