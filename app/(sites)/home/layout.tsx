import Navbar from "@/components/Navbar";
import { PropsWithChildren } from "react";

const HomeLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-white pb-0.5">
      <Navbar />
      {children}
    </div>
  );
};

export default HomeLayout;
