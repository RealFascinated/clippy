"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type ShareXConfigProps = {
	uploadToken?: string | null;
};

export default function ShareXConfig({ uploadToken }: ShareXConfigProps) {
	const [loading, setLoading] = useState<boolean>(false);

	const handleDownload = () => {
		setLoading(true);
		setTimeout(() => setLoading(false), 2000);
	};
	return (
		<Card className="w-full">
			<CardTitle>Configs</CardTitle>
			<CardContent className="max-w-sm p-3">
				{uploadToken ? (
					<span className="text-muted-foreground">
						Download a config for an upload client
					</span>
				) : (
					<span>
						You do not have an upload token. Please generate one to download a
						config.
					</span>
				)}
			</CardContent>
			<CardFooter>
				{uploadToken && (
					<Link href="/api/user/config/sharex" prefetch={false}>
						<Button
							className="w-fit"
							onClick={handleDownload}
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Downloading...
								</>
							) : (
								"Download ShareX"
							)}
						</Button>
					</Link>
				)}
			</CardFooter>
		</Card>
	);
}
