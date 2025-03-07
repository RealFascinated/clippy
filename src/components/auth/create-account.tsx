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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const registerSchema = z.object({
  name: z.string(),
  username: z
    .string()
    .min(3, {
      message: "Your username must be atleast 4 characters.",
    })
    .max(12, {
      message: "Your username must not be more than 16 characters.",
    }),
  email: z.string().email({
    message: "You need to enter a valid email.",
  }),
  password: z.string().min(8, {
    message: "Your password must be atleast 8 characters.",
  }),
});

export default function CreateAccount() {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  function onSubmit({
    name,
    username,
    email,
    password,
  }: z.infer<typeof registerSchema>) {
    console.log("Creating new account...", { name, username, email, password });
    authClient.signUp.email(
      {
        name,
        username,
        email,
        password,
      },
      {
        onSuccess: () => {
          console.log("Account created successfully, welcome!");
          router.push("/dashboard");
          router.refresh();
        },
        onError: error => {
          console.log({ error });
          setError(error.error.message);
        },
      }
    );
  }

  return (
    <Card className="min-w-[400px] min-h-fit">
      <CardContent className="h-full w-full flex flex-col gap-6 items-center justify-center px-8 py-6">
        <div className="flex flex-col items-center text-center gap-1">
          <span className="font-bold text-xl">Create an account</span>
          <span className="text-muted-foreground">
            Enter your email below to create your account
          </span>
        </div>

        <div className="w-full flex flex-col gap-2 items-center">
          {error && <div className="text-red-400">{error}</div>}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6 w-full"
            >
              <div className="flex flex-col gap-2 w-full">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Username */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="username"
                          {...field}
                          onChange={event => {
                            event.target.value =
                              event.target.value.toLowerCase();
                            field.onChange(event);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        <Input
                          placeholder="password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Auth Buttons */}
              <div className="flex flex-col w-full gap-4">
                <Button>Register</Button>
                <Link
                  href="/auth/login"
                  className="text-muted-foreground text-center hover:opacity-80 transition-all transform-gpu"
                  prefetch={false}
                >
                  <span>Already have an account</span>
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
