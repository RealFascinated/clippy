import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import Link from "next/link";

type ShareXConfigProps = {
  uploadToken?: string | null;
};

export default function ShareXConfig({ uploadToken }: ShareXConfigProps) {
  return (
    <Card className="w-full">
      <CardTitle>Configs</CardTitle>
      <CardContent className="p-3">
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
            <Button className="w-fit">Download ShareX</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
