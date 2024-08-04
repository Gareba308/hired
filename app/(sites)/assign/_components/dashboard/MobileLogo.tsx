import Image from "next/image";
import Link from "next/link";

const MobileLogo = () => {
  return (
    <Link href="/manage">
        <Image
          height={112}
          width={112}
          alt="logo"
          src="https://res.cloudinary.com/dflvibeo6/image/upload/v1684702678/My_project-1_4_zwzqjm.png"
          quality={100}
          priority={true}
        />
    </Link>
  );
};

export default MobileLogo;
