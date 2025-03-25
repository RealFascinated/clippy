import Statistic from "@/components/statistic";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { env } from "@/lib/env";
import { getServerMetrics } from "@/lib/utils/server-metrics";
import NotSignedIn from "@/providers/auth/not-signed-in";
import SignedIn from "@/providers/auth/signed-in";
import { ImageIcon, UserIcon } from "lucide-react";
import Link from "next/link";

export const revalidate = 300; // 5 minutes

const features = [
  {
    title: "Fast Uploads",
    description: "Upload images and videos quickly and easily.",
  },
  {
    title: "User Customization",
    description: "We offer a range of customization options to make your experience as unique as you are.",
  },
  {
    title: "Secure and Reliable",
    description: "We use the latest technology to ensure that your images are secure and reliable.",
  },
];

export default async function HomePage() {
  const metrics = await getServerMetrics();

  return (
    <main className="flex w-full">
      <div className="flex flex-col gap-6 w-full mt-6">
        {/* Header */}
        <span className="uppercase text-sm font-bold text-primary">
          Reliable Image Hosting
        </span>
        <h1 className="text-3xl font-bold">{env.NEXT_PUBLIC_WEBSITE_NAME}</h1>

        <p className="text-foreground">
          {env.NEXT_PUBLIC_WEBSITE_LANDING_DESCRIPTION}
        </p>

        {/* Auth Buttons */}
        <div className="flex flex-col gap-2 w-full">
          <NotSignedIn>
            <Link href="/auth/register" prefetch={false}>
              <Button className="w-fit" variant="outline">
                Register
              </Button>
            </Link>
          </NotSignedIn>
          <SignedIn>
            <Link href="/dashboard" prefetch={false}>
              <Button className="w-fit" variant="outline">
                Dashboard
              </Button>
            </Link>
          </SignedIn>
        </div>

        <Separator className="mb-8 mt-4" />

        <div className="flex flex-col gap-16 w-full">
          {/* Features */}
          <div className="flex flex-col gap-4 w-full">
            <h2 className="text-3xl font-bold text-center">Features</h2>
            <p className="text-foreground text-center">
              We offer a range of features to make your experience as smooth as
              possible.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>

          {/* Instance Metrics */}
          <div className="flex flex-col gap-4 w-full">
            <h2 className="text-3xl font-bold text-center">Instance Metrics</h2>
            <p className="text-foreground text-center">
              This is the metrics for the instance of the website.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Statistic
                name="Total Images Uploaded"
                value={metrics.totalFiles}
                format="number"
                icon={<ImageIcon />}
              />
              <Statistic
                name="Total Storage Used"
                value={metrics.totalStorage}
                format="bytes"
                icon={<ImageIcon />}
              />
              <Statistic
                name="Total Users"
                value={metrics.totalUsers}
                format="number"
                icon={<UserIcon />}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-3 h-30 bg-muted rounded-lg p-4 border border-muted/50 transition-all duration-300 bg-gradient-to-br from-background/90 to-background/70 hover:from-background/95 hover:to-background/75">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}