"use client";

import { authClient } from "@/lib/client-auth";
import { AuthType } from "@/type/auth-type";
import { zodResolver } from "@hookform/resolvers/zod";
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

const loginSchema = z.object({
  email: z.string().email({
    message: "You need to enter a valid email.",
  }),
  password: z.string(),
});

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

type AccountFormProps = {
  type: AuthType;
};

export default function AccountForm({ type }: AccountFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  function onLoginSubmit({ email, password }: z.infer<typeof loginSchema>) {
    authClient.signIn.email(
      {
        email: email,
        password,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
          router.refresh();
        },
        onError: error => {
          setError(error.error.message);
        },
      }
    );
  }

  function onRegisterSubmit({
    name,
    username,
    email,
    password,
  }: z.infer<typeof registerSchema>) {
    authClient.signUp.email(
      {
        name,
        username,
        email,
        password,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
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
          <span className="font-bold text-xl">
            {type == "login" ? "Sign In" : "Create an account"}
          </span>
          <span className="text-muted-foreground">
            {type == "login"
              ? "Enter your email below to sign in to your account"
              : "Enter your email below to create your account"}
          </span>
        </div>

        <div className="w-full flex flex-col gap-2 items-center">
          {error && <div className="text-red-400">{error}</div>}

          {type == "login" ? (
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="flex flex-col gap-6 w-full"
              >
                <div className="flex flex-col gap-2 w-full">
                  {/* Email */}
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="name@example.com"
                            type="email"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="password"
                            type="password"
                            autoComplete="current-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Auth Buttons */}
                <div className="flex flex-col w-full gap-2">
                  <Button>Sign In</Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-muted-foreground hover:opacity-80 transition-all transform-gpu"
                    onClick={() => {
                      router.push("/auth/register");
                      setError(undefined);
                    }}
                  >
                    Don&apos;t have an account? Register
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                className="flex flex-col gap-6 w-full"
              >
                <div className="flex flex-col gap-2 w-full">
                  {/* Name */}
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            type="text"
                            autoComplete="name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Username */}
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="username"
                            type="text"
                            autoComplete="username"
                            {...field}
                            onChange={(event) => {
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
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="name@example.com"
                            type="email"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="password"
                            type="password"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Auth Buttons */}
                <div className="flex flex-col w-full gap-2">
                  <Button>Register</Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-muted-foreground hover:opacity-80 transition-all transform-gpu"
                    onClick={() => {
                      router.push("/auth/login");
                      setError(undefined);
                    }}
                  >
                    Already have an account? Sign in
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
