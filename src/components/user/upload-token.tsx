"use client";

import { authClient } from "@/lib/client-auth";
import { Button } from "../ui/button";
import Request from "@/lib/request";
import PuffLoader from "react-spinners/PuffLoader";
import { Card, CardContent } from "../ui/card";

export default function UploadToken() {
  const { data, refetch } = authClient.useSession();
  const user = data?.user;

  return (
    <Card className="w-full">
      <CardContent className="p-2">
        {user ? (
          <div className="flex flex-col gap-2">
            <span>
              Current upload token:{" "}
              <span className="text-muted-foreground blur-sm hover:blur-none transition-all transform-gpu">
                {user.uploadToken}
              </span>
            </span>
            <Button
              onClick={async () => {
                await Request.post("/api/user/reset-upload-token");
                refetch();
              }}
              className="w-fit"
            >
              Reset
            </Button>
          </div>
        ) : (
          <PuffLoader color="#fff" size={32} />
        )}
      </CardContent>
    </Card>
  );
}
