import CustomButton from "@/components/custom/button";
import CustomInput from "@/components/custom/input";
import { FileText, Layers, Plus, Search, Settings } from "lucide-react";
import Image from "next/image";
import PrimaryLogo from "@/public/logos/primary-icon.svg";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full justify-center flex p-4">
      <div className="w-full max-w-2xl flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center">
          <Image src={PrimaryLogo} alt="Draft" width={50} height={50} />
          <h1 className="text-2xl font-bold">Home</h1>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link href="/samples">
            <CustomButton variant="secondary" className="w-full">
              <Layers className="w-4 h-4" />
              Writing Samples
            </CustomButton>
          </Link>
          <CustomButton className="w-full">
            <Plus className="w-4 h-4" />
            New Draft
          </CustomButton>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <CustomInput
            className="w-full"
            placeholder="Search for a draft here"
          />
        </div>
      </div>
    </div>
  );
}
