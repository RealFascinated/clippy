import { env } from "@/lib/env";
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

function NavButton({ name, icon, href }: Item) {
	return (
		<Link
			href={href}
			className="flex gap-2 hover:opacity-80 transition-all transform-gpu"
			prefetch={false}
		>
			{icon}
			{name}
		</Link>
	);
}

export default async function Navbar() {
	return (
		<header className="fle sticky flex top-0 z-50 justify-center items-center bg-card/60 backdrop-blur-md border border-border gap-3 px-4 select-none">
			<SidebarToggle />

			<div className="flex max-w-7xl items-center h-[var(--header-height)] w-full justify-between">
				<div className="flex gap-10 items-center">
					{/* Website */}
					<Link
						href="/"
						className="flex items-center gap-2 font-bold hover:opacity-80 transition-all transform-gpu"
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
						<span>{env.NEXT_PUBLIC_WEBSITE_NAME}</span>
					</Link>

					{/* Links */}
					<div className="flex gap-4 items-center">
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
				<NotSignedIn>
					<NavButton name="Login" className="h-8" href="/auth/login" />
				</NotSignedIn>
				<SignedIn>
					<ProfileButton />
				</SignedIn>
			</div>
		</header>
	);
}
