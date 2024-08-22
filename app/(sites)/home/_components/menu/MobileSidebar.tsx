import React, { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

const MobileSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openSheet = () => setIsOpen(true);
  const closeSheet = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button onClick={openSheet} className="md:hidden transition">
          <Menu />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="p-0 bg-white">
        <Sidebar onClose={closeSheet} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;