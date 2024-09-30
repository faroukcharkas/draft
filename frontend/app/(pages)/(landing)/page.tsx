import NoiseOverlay from "@/components/noise-overlay";
import Logo from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import "material-symbols/rounded.css";
import Link from "next/link";
export default function LandingPage() {
  return (
    <div className="h-screen w-screen flex flex-1 justify-center items-center bg-background">
      <NoiseOverlay />
      <div className="z-10 flex flex-col items-center justify-center gap-8">
        <Logo size={64} />
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold">Express yourself</h1>
          <h1 className="text-6xl font-bold">effortlessly.</h1>
        </div>
        <p className="text-muted-foreground">
          Currently reaching perfection in closed beta. <br /> Unauthorized new accounts will be deleted.
        </p>
        <div className="flex gap-4">
          <Link href="/signup">
            <Button className="gap-2">
              <span className="material-symbols-rounded">person_add</span>
            Sign up
          </Button>
          </Link>
          <Link href="/login">
            <Button className="gap-2" variant="outline">
              <span className="material-symbols-rounded">login</span>
              Log in
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
