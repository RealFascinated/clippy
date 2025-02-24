"use client";

import { authClient } from "@/lib/client-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function AccountLogin() {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit({ email, password }: z.infer<typeof registerSchema>) {
    authClient.signIn.email(
      {
        email: email,
        password,
      },
      {
        onSuccess: () => {
          router.push("/user/dashboard");
          router.refresh();
        },
        onError: error => {
          setError(error.error.message);
        },
      }
    );
  }

  return (
    <Card className="min-w-[400px] min-h-fit">
      <CardContent className="h-full w-full flex flex-col gap-6 items-center justify-center px-8 py-6">
        <div className="flex flex-col items-center text-center gap-1">
          <span className="font-bold text-xl">Sign In</span>
          <span className="text-muted-foreground">Enter your email below to sign in to your account</span>
        </div>

        {error && <div className="text-red-400">{error}</div>}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2 w-full">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Auth Buttons */}
            <div className="flex flex-col w-full gap-2">
              <Button>Sign In</Button>
              <Link href="/auth/register">
                <Button type="button" variant="secondary" className="w-full">
                  Register
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
