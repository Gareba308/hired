import Navbar from "@/components/Navbar";
import { GoogleAnalytics } from '@next/third-parties/google'
import { PropsWithChildren } from "react";

const HomeLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-white pb-0.5">
      <Navbar />
      {children}
      <GoogleAnalytics gaId="G-D94MPR6B9P" />
    </div>
  );
};

export default HomeLayout;
