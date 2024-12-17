import Image from "next/image";

export default function Logo({
  size = 32,
  color = "black",
}: {
  size: number;
  color: "black" | "white" | "primary" | "gray";
}) {
  let logo;
  switch (color) {
    case "black":
      logo = "/logos/black-icon.svg";
      break;
    case "white":
      logo = "/logos/white-icon.svg";
      break;
    case "primary":
      logo = "/logos/primary-icon.svg";
      break;
    case "gray":
      logo = "/logos/gray-icon.svg";
      break;
    default:
      logo = "/logos/black-icon.svg";
  }
  return (
    <div>
      <Image src={logo} alt="draft" width={size} height={size} />
    </div>
  );
}
