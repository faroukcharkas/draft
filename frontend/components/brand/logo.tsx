import Image from "next/image";
import logo from "../../assets/PentipLogo.svg";

export default function Logo({ size = 32 }: { size: number }) {
  return <Image src={logo} alt="pentip" width={size} height={size} />;
}

