import Statistic from "@/components/statistic";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { config } from "@/config";
import { env } from "@/lib/env";
import { getServerMetrics } from "@/lib/utils/server-metrics";
import NotSignedIn from "@/providers/auth/not-signed-in";
import SignedIn from "@/providers/auth/signed-in";
import { ImageIcon, UserIcon, Upload, Shield, Palette, ServerIcon, Github, Server } from "lucide-react";
import Link from "next/link";

export const revalidate = 300; // 5 minutes

const features = [
  {
    title: "Fast Uploads",
    description: "Upload and share your media files in seconds.",
    icon: <Upload className="w-6 h-6" />,
  },
  {
    title: "User Customization",
    description: "Personalize your experience with custom settings and preferences.",
    icon: <Palette className="w-6 h-6" />,
  },
  {
    title: "Secure and Reliable",
    description: "Your files are stored safely with regular backups.",
    icon: <Shield className="w-6 h-6" />,
  },
];

const selfHosting = [
  {
    title: "Open Source",
    description: "Fully open source and available on GitHub. Contribute or fork to customize.",
    icon: <Github className="w-6 h-6" />,
    button: "View on GitHub",
    url: config.githubUrl,
  },
  {
    title: "Self Hosted",
    description: "Deploy on your own infrastructure with Docker or manual installation.",
    icon: <Server className="w-6 h-6" />,
    button: "View Documentation",
    url: config.documentationUrl,
  },
];

export default async function HomePage() {
  const metrics = await getServerMetrics();

  return (
    <main className="flex w-full">
      <div className="flex flex-col gap-8 w-full">
        {/* Hero Section */}
        <div className="relative w-full rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8">
          <div className="flex flex-col gap-6">
            {/* Logo and Name */}
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              <span className="uppercase text-sm font-bold text-primary tracking-wider">
                Reliable Image Hosting
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              {env.NEXT_PUBLIC_WEBSITE_NAME}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {env.NEXT_PUBLIC_WEBSITE_LANDING_DESCRIPTION}
            </p>

            {/* Auth Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <NotSignedIn>
                <Link href="/auth/register" prefetch={false}>
                  <Button size="lg" className="w-full sm:w-fit">
                    Get Started
                  </Button>
                </Link>
              </NotSignedIn>
              <SignedIn>
                <Link href="/dashboard" prefetch={false}>
                  <Button size="lg" variant="outline" className="w-full sm:w-fit">
                    Go to Dashboard
                  </Button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex flex-col gap-16 w-full">
          {/* Features */}
          <div className="flex flex-col gap-10 w-full">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold text-center">Features</h2>
              <p className="text-muted-foreground text-center max-w-2xl mx-auto">
                Everything you need to host and share your media files.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                />
              ))}
            </div>
          </div>

          {/* Instance Metrics */}
          <div className="flex flex-col gap-10 w-full">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold text-center">
                Trusted by the Community
              </h2>
              <p className="text-muted-foreground text-center max-w-2xl mx-auto">
                Join the users who trust us with their media files.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Statistic
                name="Total Images Uploaded"
                value={metrics.totalFiles}
                format="number"
                icon={<ImageIcon className="w-6 h-6" />}
              />
              <Statistic
                name="Total Storage Used"
                value={metrics.totalStorage}
                format="bytes"
                icon={<ServerIcon className="w-6 h-6" />}
              />
              <Statistic
                name="Total Users"
                value={metrics.totalUsers}
                format="number"
                icon={<UserIcon className="w-6 h-6" />}
              />
            </div>
          </div>

          {/* Self Hosting */}
          <div className="flex flex-col gap-10 w-full">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold text-center">
                Self Host Your Instance
              </h2>
              <p className="text-muted-foreground text-center max-w-2xl mx-auto">
                Take control of your data by hosting your own instance.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selfHosting.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 h-full bg-card rounded-xl p-6 border border-border/50 transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="text-primary">{item.icon}</div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{item.description}</p>
                  <Link href={item.url} className="mt-auto">
                    <Button className="w-full" variant="outline">
                      {item.button}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 h-full bg-card rounded-xl p-6 border border-border/50 transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
      <div className="flex items-center gap-2">
        <div className="text-primary">{icon}</div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}