import { cva, type VariantProps } from "class-variance-authority";

const buttonStyles = cva(
  "p-1 rounded-md transition-colors duration-200 ease-in-out",
  {
    variants: {
      isToggled: {
        true: "bg-gray-200 text-gray-700 hover:bg-gray-300",
        false: "bg-transparent",
      },
    },
    defaultVariants: {
      isToggled: false,
    },
  }
);

interface SingleIconToggleProps extends VariantProps<typeof buttonStyles> {
  onClick: () => void;
  icon: React.ReactNode;
}

export function SingleIconToggle({
  onClick,
  isToggled,
  icon,
}: SingleIconToggleProps) {
  return (
    <button
      onClick={onClick}
      className={buttonStyles({ isToggled })}
    >
      {icon}
    </button>
  );
}
