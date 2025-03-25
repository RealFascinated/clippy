import Statistic from "@/components/statistic";
import { Button } from "@/components/ui/button";
import { config } from "@/config";
import { env } from "@/lib/env";
import { getServerMetrics } from "@/lib/utils/server-metrics";
import NotSignedIn from "@/providers/auth/not-signed-in";
import SignedIn from "@/providers/auth/signed-in";
import {
  ImageIcon,
  UserIcon,
  Upload,
  Shield,
  Palette,
  ServerIcon,
  Github,
  Server,
  ArrowDown,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import ScrollArrow from "@/components/scroll-arrow";
import { Metadata } from "next";

export const revalidate = 300; // 5 minutes

export const metadata: Metadata = {
  title: "Welcome",
};

const features = [
  {
    title: "Fast Uploads",
    description: "Upload and share your media files in seconds.",
    icon: <Upload className="w-6 h-6" />,
  },
  {
    title: "User Customization",
    description:
      "Personalize your experience with custom settings and preferences.",
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
    description:
      "Fully open source and available on GitHub. Contribute or fork to customize.",
    icon: <Github className="w-6 h-6" />,
    button: "View on GitHub",
    url: config.githubUrl,
  },
  {
    title: "Self Hosted",
    description:
      "Deploy on your own infrastructure with Docker or manual installation.",
    icon: <Server className="w-6 h-6" />,
    button: "View Documentation",
    url: config.documentationUrl,
  },
];

export default async function HomePage() {
  const metrics = await getServerMetrics();

  return (
    <main className="flex w-full">
      <div className="flex flex-col w-full">
        {/* Hero Section */}
        <div className="relative w-full min-h-[90vh] overflow-hidden">
          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center">
            <div className="flex flex-col gap-10 max-w-5xl w-full">
              {/* Main Content */}
              <div className="flex flex-col gap-8">
                {/* Header */}
                <div className="flex items-center gap-2">
                  <span className="text-primary text-sm uppercase font-medium">
                    Reliable, Fast, and Secure
                  </span>
                  <span className="text-muted-foreground text-sm">
                    <CheckCircle className="w-4 h-4" />
                  </span>
                </div>

                {/* Title & Description */}
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                  {env.NEXT_PUBLIC_WEBSITE_NAME}
                </h1>
                <span className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                  {env.NEXT_PUBLIC_WEBSITE_DESCRIPTION}
                </span>

                {/* Auth Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <NotSignedIn>
                    <Link href="/auth/register" prefetch={false}>
                      <Button
                        size="lg"
                        className="w-full sm:w-fit text-lg px-8 h-14"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </NotSignedIn>
                  <SignedIn>
                    <Link href="/dashboard" prefetch={false}>
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-fit text-lg px-8 h-14"
                      >
                        Go to Dashboard
                      </Button>
                    </Link>
                  </SignedIn>
                </div>
              </div>

              {/* Features Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-border/50">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {feature.icon}
                    </div>
                    <span className="text-sm font-medium">{feature.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll Arrow */}
            <ScrollArrow />
          </div>
        </div>

        <div className="flex flex-col gap-16 w-full p-8">
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
          {env.NEXT_PUBLIC_SHOW_METRICS && (
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
          )}

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
