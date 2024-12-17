import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CustomInputProps extends React.ComponentProps<"input"> {
  children?: React.ReactNode;
}

export default function CustomInput({
  className,
  children,
  ...props
}: CustomInputProps) {
  return (
    <Input
      className={cn(
        "font-medium border-2 focus-visible:ring-primary",
        className
      )}
      {...props}
    />
  );
}
