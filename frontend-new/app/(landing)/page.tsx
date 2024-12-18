import CustomButton from "@/components/custom/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Draft</h1>
      <Link href="/home">
        <CustomButton>Start Drafting</CustomButton>
      </Link>
    </div>
  );
}