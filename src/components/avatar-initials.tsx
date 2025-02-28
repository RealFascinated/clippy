import { cn } from "@/lib/utils/utils";
import { cva, VariantProps } from "class-variance-authority";

const avatarVariants = cva(
  "size-24 flex justify-center items-center text-3xl bg-muted rounded-full",
  {
    variants: {
      size: {
        xs: "size-6 text-sm",
        sm: "size-10 text-lg",
        default: "size-16 text-2xl",
        lg: "size-24 text-4xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

/**
 * The props for the avatar initials.
 */
type AvatarInitialsProps = {
  /**
   * The optional classes to add to the avatar initials.
   */
  className?: string | undefined;

  /**
   * The name to show initials for.
   */
  name: string;
};

const AvatarInitials = ({
  className,
  name,
  size,
}: AvatarInitialsProps & VariantProps<typeof avatarVariants>) => {
  const initials = name
    .split(" ")
    .map((segment: string) => segment.charAt(0).toUpperCase())
    .join("");
  return (
    <div className={cn(avatarVariants({ className, size }))}>{initials}</div>
  );
};
export default AvatarInitials;
