import { cva, type VariantProps } from "class-variance-authority";

const buttonStyles = cva(
  [
    "h-[40px] w-[40px] rounded-xl transition-colors duration-200 ease-in-out",
    "flex items-center justify-center",
  ],
  {
    variants: {
      isToggled: {
        true: [
          "bg-gradient-to-b from-[#FDFDFD] to-[#F5F5F5] text-gray-700 hover:bg-gray-300",
          "shadow-md",
          "border-t border-[white]",
        ],
        false: ["bg-transparent text-gray-600"],
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
