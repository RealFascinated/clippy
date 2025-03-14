import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/utils";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

type PasswordInputProps = {
  className?: string | undefined;
  name?: string;
};

export default function PasswordInput({
  className,
  name = "password",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <div className="w-full group relative">
      <Lock className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        className={cn("pl-7", className)}
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder="Your Password"
        required
      />

      {/* Visibility Toggle */}
      <Button
        className="opacity-0 absolute right-2 top-1/2 -translate-y-1/2 size-6 text-muted-foreground group-hover:opacity-100 transition-opacity transform-gpu"
        type="button"
        variant="ghost"
        onClick={() => setShowPassword(prev => !prev)}
      >
        {showPassword ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
}
