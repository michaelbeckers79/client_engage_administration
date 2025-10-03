import {
  Search,
  Coffee,
  MessageSquareCode,
  Pin,
  ClipboardList,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, InputWrapper } from "@/components/ui/input";
import { useLayout } from "./context";

export function HeaderToolbar() {
  const { isMobile } = useLayout();
  
  const handleInputChange = () => {};

  return (
    <nav className="flex items-center gap-2.5">
      
    </nav>
  );
}
