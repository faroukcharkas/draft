import { cva, type VariantProps } from "class-variance-authority";

const toggleStyle = cva(
  [
    "w-[40px] h-[40px] rounded-xl transition-colors duration-200 ease-in-out hover:shadow-inner",
    "flex items-center justify-center",
  ],
  {
    variants: {
      isToggled: {
        true: [
          "bg-gradient-to-b from-[popover] to-[card] border text-gray-700",
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

interface ToggleProps extends VariantProps<typeof toggleStyle> {
  onClick: () => void;
  iconName: string;
}

export function Toggle({
  onClick,
  isToggled,
  iconName,
}: ToggleProps) {
  return (
    <button
      onClick={onClick}
      className={toggleStyle({ isToggled })}
    >
      <span className="material-symbols-rounded h-[24px] w-[24px]">{iconName}</span>
    </button>
  );
}
