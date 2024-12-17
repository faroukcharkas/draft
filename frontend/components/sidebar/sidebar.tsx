import SidebarItem from "./parts/item";
import Logo from "../brand/logo";
import "material-symbols/rounded.css";

export default function Sidebar() {
  return (
    <div className="flex-0 min-w-[300px] pr-1 relative z-10">
      <div className="relative z-10">
        <div className="flex items-center justify-start px-6 py-6">
          <div className="max-h-[50px]">
            <Logo size={50} color="primary" />
          </div>
        </div>
        <div className="flex-1 flex flex-col px-6 gap-2">
          <SidebarItem
            href="/home/documents"
            icon={
              <span className="material-symbols-rounded text-muted-foreground">
                description
              </span>
            }
          >
            Documents
          </SidebarItem>
          <SidebarItem
            href="/home/samples"
            icon={
              <span className="material-symbols-rounded text-muted-foreground">
                folder_open
              </span>
            }
          >
            Samples
          </SidebarItem>
        </div>
      </div>
    </div>
  );
}
