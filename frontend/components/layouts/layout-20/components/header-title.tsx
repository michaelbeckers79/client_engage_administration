import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { PanelRight } from "lucide-react";
import { useLayout } from "./context";
import Link from "next/link";

export function HeaderTitle() {    
  const { isSidebarOpen, isMobile, sidebarToggle } = useLayout();
  
  return (
    <div className="flex flex-col items-start justify-center gap-0.5 pb-5 lg:pb-0 lg:mb-0 lg:px-0">
      <div className="flex items-center gap-2">
        {(!isSidebarOpen && !isMobile) && <Button mode="icon" variant="dim" onClick={() => sidebarToggle()} className="-ms-2">
          <PanelRight />
        </Button>}
        <div className="">
        
        </div>
      </div>      
    </div>
  );
}
