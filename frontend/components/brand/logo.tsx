import Image from "next/image";
import IconLogo from "../../assets/DraftIconLogo.svg";
import TextLogo from "../../assets/DraftTextLogo.svg";

export default function Logo({ size = 32, variant = "icon" }: { size: number, variant: "icon" | "text" }) {
  return (
    <div className="text-primary">
      {variant === "icon" ? (
        <Image src={IconLogo} alt="pentip" width={size} height={size} />
      ) : (
        <Image src={TextLogo} alt="pentip" height={size} style={{ width: 'auto', maxHeight: size }} />
      )}
    </div>
  );
}
