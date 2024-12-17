import Image from "next/image";
import PrimaryLogo from "@/public/logos/primary-icon.svg";
import CustomButton from "@/components/custom/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Samples() {
  return (
    <div className="w-full justify-center flex p-4">
      <div className="w-full max-w-2xl flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center">
          <Image src={PrimaryLogo} alt="Draft" width={50} height={50} />
          <h1 className="text-2xl font-bold">Writing Samples</h1>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <Link href="/samples/new">
            <CustomButton variant="default" className="w-full">
              <Plus className="w-4 h-4" />
              New Draft
            </CustomButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
