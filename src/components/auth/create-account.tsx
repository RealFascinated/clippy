"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
  username: z.string().min(3, {
    message: "Your username must be atleast 4 characters.",
  }),
  email: z.string().email({
    message: "You need to enter a valid email.",
  }),
  password: z.string().min(8, {
    message: "Your password must be atleast 8 characters.",
  }),
});

export default function CreateAccount() {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    console.log(values);
  }

  return (
    <Card className="min-w-[400px] min-h-fit">
      <CardContent className="h-full w-full flex flex-col gap-6 items-center justify-center p-8">
        <div className="flex flex-col items-center text-center gap-1">
          <span className="font-bold text-xl">Create an account</span>
          <span className="text-muted-foreground">
            Enter your email below to create your account
          </span>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 w-full"
          >
            <div className="flex flex-col gap-2 w-full">
              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="clippy" {...field} />
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

            {/* Submit Register */}
            <Button>Register Your Account</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
