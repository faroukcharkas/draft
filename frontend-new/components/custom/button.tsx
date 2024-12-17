import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomButtonProps extends ButtonProps {
  children?: React.ReactNode;
}

export default function CustomButton({
  className,
  variant = "default",
  children,
  ...props
}: CustomButtonProps) {
  const variantStyles = {
    default:
      "bg-gradient-to-br from-primary to-primaryDark border-border hover:bg-primaryLight",
    destructive:
      "bg-gradient-to-br from-red-500 to-red-600 border-red-600 hover:bg-red-600",
    outline:
      "bg-transparent border-primaryDark text-primaryDark hover:bg-primaryDark/10",
    secondary:
      "text-gray-500 bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 hover:bg-gray-200",
    ghost: "bg-transparent border-transparent hover:bg-primaryLight",
    link: "bg-transparent border-transparent underline-offset-4 hover:underline text-primaryDark",
  };

  return (
    <Button
      className={cn(
        "font-medium border-2",
        variantStyles[variant as keyof typeof variantStyles],
        className
      )}
      variant={variant}
      {...props}
    >
      {children}
    </Button>
  );
}
